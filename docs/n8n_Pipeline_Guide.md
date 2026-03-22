# 🚀 [n8n] AI Deep Research Pipeline Blueprint & 가이드

## 📌 개요
홈페이지의 Webhook을 트리거로 하여, 사용자가 텍스트를 넣으면 AI가 가치평가 및 웹 검색(SerpAPI + Jina AI)을 통해 심층 보고서를 작성하여 Supabase DB에 자동 발행하고 텔레그램으로 알림을 주는 8단계 무인 연구 파이프라인입니다.

---

## 🏗️ 전체 파이프라인 8단계 구조

1. **Webhook (트리거)** : JSON 형태로 `title`, `category`, `text` 수신
2. **OpenAI 1차 (Scoring)** : 내용 가치 1~4점 평가 및 검색 쿼리 3개 도출 (JSON Schema 강제)
3. **IF 필터 (Score >= 3)** : 3점 미만의 스팸/단순 질문 필터링으로 API 비용 절약
4. **SerpAPI 검색** : 도출된 쿼리로 구글 검색 수행
5. **Jina AI 리더** : 검색된 상위 1개 링크의 본문을 Markdown 텍스트로 전체 스크랩
6. **OpenAI 2차 (보고서 작성)** : 사용자 입력과 웹 스크랩 본문을 융합하여 심층 리포트 생성
7. **Supabase (DB 삽입)** : `research_reports` 테이블에 최종 보고서 인서트
8. **Telegram (알림)** : 관리자 방으로 푸시 메시지 전송 (Markdown 파싱)

---

## 🛠️ 수동 세팅 가이드 (복붙용)
*n8n 버전 이슈로 자동 Import([m] is not iterable 버그)가 실패할 경우, 아래 내용으로 수동 구성합니다.*

### 1단계. Webhook
- **Method**: `POST`
- **Path**: `deep-research`
- **Respond**: `Immediately`

### 2단계. OpenAI (1차: 가치 평가)
- **Model**: `gpt-4o-mini`
- **Message Content**:
  ```text
  =입력된 텍스트가 심층 조사/전문적 분석 가치가 있는지 1~4점으로 평가하고, 관련 검색어 최대 3개를 도출해 무조건 지정된 JSON Schema로 대답하세요.

  [입력 텍스트]: {{ $json.body.text }}
  ```
- **Response Format**: `JSON Schema`
  ```json
  {
    "type": "object",
    "properties": {"score": {"type": "integer"}, "search_queries": {"type": "array", "items": {"type": "string"}}},
    "required": ["score", "search_queries"]
  }
  ```

### 3단계. If 필터
- **Conditions**: `Number`
- **Value 1**: `={{ $json.score }}`
- **Operation**: `Larger or equal` (>=)
- **Value 2**: `3`

### 4단계. HTTP Request (SerpAPI)
- **Method**: `GET`
- **URL**: `=https://serpapi.com/search.json?q={{ $json.search_queries.join('+') }}&api_key=YOUR_API_KEY`

### 5단계. HTTP Request (Jina AI)
- **Method**: `GET`
- **URL**: `=https://r.jina.ai/{{ $('HTTP Request').item.json.organic_results[0].link }}`

### 6단계. OpenAI (2차: 심층 리포트)
- **Model**: `gpt-4o`
- **Message Content**:
  ```text
  =아래의 [입력 텍스트]와 [Jina 원문]을 융합해 완벽한 심층 보고서를 지정된 JSON으로 작성하세요.

  [입력]: {{ $('Webhook').item.json.body.text }}
  [Jina 원문]: {{ $json.data.content }}
  ```
- **Response Format**: `JSON Schema`
  ```json
  {
    "type": "object",
    "properties": {"summary": {"type": "string"}, "content": {"type": "string"}},
    "required": ["summary", "content"]
  }
  ```

### 7단계. Supabase (DB 적재)
- **Table Name**: `research_reports`
- **Fields**:
  - `title` : `={{ $('Webhook').item.json.body.title }}`
  - `category` : `={{ $('Webhook').item.json.body.category }}`
  - `summary` : `={{ $json.summary }}`
  - `content` : `={{ $json.content }}`

### 8단계. Telegram
- **Parse Mode**: `Markdown`
- **Text**:
  ```text
  =🤖 **[AI 심층 리서치 발간]**

  🔹 **제목:** {{ $('Webhook').item.json.body.title }}
  🔹 **모드:** {{ $('Webhook').item.json.body.category }}

  📝 **심층 요약:**
  {{ $('OpenAI').item.json.summary }}

  🔗 **원문 확인하기:**
  https://thewiselaw.co.kr/insights/{{ $json.id }}
  ```

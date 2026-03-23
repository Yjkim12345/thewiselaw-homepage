'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, FileText, CheckCircle2, AlertCircle, Clock, BookOpen, Lock, Settings, Activity, FileCheck, ArrowRight } from 'lucide-react'

// types
type Report = {
  id: string
  title: string
  category: string
  summary: string
  created_at: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [reports, setReports] = useState<Report[]>([])
  const [isLoadingReports, setIsLoadingReports] = useState(true)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [activeTab, setActiveTab] = useState<'trigger' | 'reports' | 'settings'>('trigger')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123!') {
      setIsAuthenticated(true)
      sessionStorage.setItem('adminAuth', 'true')
    } else {
      alert('비밀번호가 틀렸습니다.')
    }
  }

  const fetchReports = async () => {
    setIsLoadingReports(true)
    const { data, error } = await supabase
      .from('research_reports')
      .select('id, title, category, summary, created_at')
      .order('created_at', { ascending: false })
    
    if (data) setReports(data)
    setIsLoadingReports(false)
  }

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true)
    }
    fetchReports()
    const savedUrl = localStorage.getItem('n8nWebhookUrl')
    if (savedUrl) setWebhookUrl(savedUrl)
  }, [])

  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookUrl(e.target.value)
    localStorage.setItem('n8nWebhookUrl', e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!webhookUrl) {
      alert('시스템 설정에서 n8n Webhook URL을 먼저 입력해주세요!')
      setActiveTab('settings')
      return
    }

    setIsSubmitting(true)
    setStatus('idle')

    const formData = new FormData(e.currentTarget)
    const payload = {
      title: formData.get('title'),
      category: formData.get('category'),
      text: formData.get('researchText'),
    }

    try {
      // 🚨 브라우저(Front-end) CORS 우회를 위해 백엔드(Next.js API) 프록시를 통해 n8n으로 전송
      const response = await fetch('/api/n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // Basic Auth 인증 정보 포함
        body: JSON.stringify({ webhookUrl, payload }),
      })

      if (!response.ok) {
        const errortext = await response.text()
        throw new Error(`Proxy failed: ${errortext}`)
      }

      setStatus('success')
      e.currentTarget.reset()
    } catch (err) {
      console.error(err)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2 text-slate-800">관리자 접속</h1>
          <p className="text-sm text-center text-slate-500 mb-8">안전한 접속을 위해 비밀번호를 입력해주세요.</p>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 mb-4 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
          />
          <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 transition-colors">
            인증하기
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col md:flex-row">
      
      {/* 🟢 좌측 사이드바 (메뉴 및 안내) */}
      <aside className="w-full md:w-72 bg-slate-900 text-slate-300 p-6 flex flex-col items-start min-h-screen">
        <div className="flex items-center gap-3 text-white font-bold text-xl mb-10 w-full">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
            <Activity className="w-5 h-5" />
          </div>
          Admin Space
        </div>

        <nav className="space-y-2 w-full mb-10">
          <button onClick={() => setActiveTab('trigger')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'trigger' ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20' : 'hover:bg-slate-800 hover:text-white'}`}>
            <ArrowRight className="w-4 h-4" />
            1. AI 리서치 발동
          </button>
          <button onClick={() => setActiveTab('reports')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'reports' ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20' : 'hover:bg-slate-800 hover:text-white'}`}>
            <FileCheck className="w-4 h-4" />
            2. 생성 리포트 검열
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Settings className="w-4 h-4" />
            3. 파이프라인 연동
          </button>
        </nav>

        <div className="mt-auto bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
          <h3 className="text-sm font-bold text-white mb-2">💡 관리자 공간의 목적</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            이곳은 로펌 내부 직원 및 최고 관리자 전용 워크스페이스입니다. AI에 분석을 지시하고, 결과를 검수하며, n8n 자동화 서버와 홈페이지를 연결하는 관제탑 역할을 합니다.
          </p>
        </div>
      </aside>

      {/* 🟢 우측 메인 콘텐츠 공간 */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl h-screen overflow-y-auto">
        
        {/* 1. AI 리서치 발동 탭 */}
        {activeTab === 'trigger' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">AI 리서치 트리거</h1>
              <p className="text-slate-500 text-sm">
                가공되지 않은 판결문, 뉴스 기사, 리서치 원문을 AI에게 전송합니다. 전송된 데이터는 n8n 자동화 파이프라인(제미나이 2.5)을 거쳐 완벽한 리포트로 변환됩니다.
              </p>
            </header>

            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10"></div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">분석 제목 (식별용)</label>
                  <input 
                    type="text" 
                    name="title"
                    required
                    placeholder="예: 2023다12345 대법원 판례 분석 건" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">리서치 모드 선택 (온톨로지 분류)</label>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all has-[:checked]:bg-blue-50 has-[:checked]:border-blue-600 has-[:checked]:text-blue-700">
                      <input type="radio" name="category" value="일반모드" defaultChecked className="accent-blue-600 w-4 h-4 cursor-pointer" />
                      🌐 일반 경제/트렌드
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all has-[:checked]:bg-blue-50 has-[:checked]:border-blue-600 has-[:checked]:text-blue-700">
                      <input type="radio" name="category" value="법률일반혼합" className="accent-blue-600 w-4 h-4 cursor-pointer" />
                      ⚖️+🌐 법률/산업 복합
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all has-[:checked]:bg-blue-50 has-[:checked]:border-blue-600 has-[:checked]:text-blue-700">
                      <input type="radio" name="category" value="법률전용" className="accent-blue-600 w-4 h-4 cursor-pointer" />
                      ⚖️ 순수 법리 해석
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">원문 데이터 (Raw Data)</label>
                  <textarea 
                    name="researchText"
                    required
                    rows={6}
                    placeholder="여기에 판례 전문, 긴 기사, 리서치 초안 등을 통째로 복사해서 붙여넣으세요. 제미나이가 알아서 핵심을 추출합니다."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y leading-relaxed"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                  <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    {webhookUrl ? (
                      <><span className="w-2 h-2 rounded-full bg-emerald-500"></span> n8n 통신 대기 준비 완료</>
                    ) : (
                      <><span className="w-2 h-2 rounded-full bg-red-500"></span> 웹훅 주소가 설정되지 않음</>
                    )}
                  </p>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {status === 'success' && <span className="text-xs font-bold text-emerald-600 px-3 py-1.5 bg-emerald-50 rounded-lg">전송 완료!</span>}
                    {status === 'error' && <span className="text-xs font-bold text-red-600 px-3 py-1.5 bg-red-50 rounded-lg">통신 실패</span>}
                    <button 
                      type="submit"
                      disabled={isSubmitting || !webhookUrl}
                      className="w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold tracking-wide py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <><Send className="w-4 h-4" /> n8n 서버로 발사</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. 생성 리포트 검열 탭 */}
        {activeTab === 'reports' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
            <header className="mb-8 flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">리포트 보관함</h1>
                <p className="text-slate-500 text-sm">
                  AI가 분석을 완료하여 Supabase 데이터베이스에 적재한 최종 결과물을 확인합니다. 외부 공개 전 최종 검수 단계입니다.
                </p>
              </div>
              <button onClick={fetchReports} className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors shrink-0">
                새로고침
              </button>
            </header>

            <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 overflow-hidden flex flex-col">
              {isLoadingReports ? (
                <div className="flex-1 flex items-center justify-center opacity-50">
                  <span className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></span>
                </div>
              ) : reports.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <FileText className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium font-sm">아직 생성된 AI 리포트가 없습니다.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
                  {reports.map((report) => (
                    <div key={report.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer h-full max-h-[250px] flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-lg text-[11px] font-extrabold tracking-tight bg-white border border-slate-200 text-slate-700 shadow-sm">
                          {report.category}
                        </span>
                        <div className="flex items-center text-slate-400 text-xs font-bold font-mono">
                          {new Date(report.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <h3 className="text-base text-slate-800 font-bold leading-snug mb-3 line-clamp-2">
                        {report.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-4 flex-1">
                        {report.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. 파이프라인 연동 (웹훅 설정) 탭 */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">통신 파이프라인 연동</h1>
              <p className="text-slate-500 text-sm">
                홈페이지(Next.js)와 자동화 서버(n8n)를 연결하는 암호화된 통신 주소를 설정합니다.
              </p>
            </header>

            <div className="bg-white border text-left border-red-100 shadow-sm rounded-3xl p-8 mb-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[100px] -z-10"></div>
              
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                n8n Webhook 주소 입력
              </h2>
              
              <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                <strong className="text-slate-800">어떻게 연결하나요?</strong><br/>
                1. n8n 워크플로우 맨 앞에 있는 `Webhook` 노드를 엽니다.<br/>
                2. `Test URL` (또는 Production URL) 주소를 복사합니다.<br/>
                3. 아래 칸에 붙여넣기 하면 홈페이지와 n8n이 즉시 연결됩니다!
              </p>

              <div className="flex flex-col md:flex-row items-center gap-3">
                <input 
                  type="text" 
                  value={webhookUrl}
                  onChange={handleWebhookChange}
                  placeholder="https://.../webhook-test/deep-research" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-red-400 focus:bg-white transition-all font-mono"
                />
                <div className="shrink-0 px-4 py-3.5 rounded-xl bg-slate-100 text-slate-500 font-bold text-sm border-2 border-transparent">
                  자동 저장됨
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden text-sm">
              <h3 className="font-bold text-lg mb-3">🛠️ 개발자 노트 (보안)</h3>
              <p className="text-slate-400 leading-relaxed">
                현재 Webhook URL은 브라우저(로컬 스토리지)에 저장되어 유지됩니다.<br/>
                정식으로 배포할 때는 Vercel의 환경 변수(Environment Variables)에 `NEXT_PUBLIC_N8N_WEBHOOK_URL` 형태로 저장하는 것을 강력 권장합니다.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

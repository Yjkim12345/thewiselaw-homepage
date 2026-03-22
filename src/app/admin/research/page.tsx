'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scale, Database, AlertCircle, CheckCircle2, Search, FileText, Send } from 'lucide-react'

export default function AdminResearchInput() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')

    // Form data extraction
    const formData = new FormData(e.currentTarget)
    const payload = {
      title: formData.get('title'),
      category: formData.get('category'),
      text: formData.get('researchText'),
    }

    try {
      // 나중에 이 곳을 n8n Webhook URL을 호출하도록 변경합니다.
      // const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // })
      
      console.log('n8n 트리거로 전송될 페이로드:', payload)
      // 인위적 지연 (로딩 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setStatus('success')
      e.currentTarget.reset()
    } catch (err) {
      console.error(err)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200">
      <header className="border-b border-slate-800/50 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-indigo-500" />
            <span className="font-bold text-lg tracking-tight text-white">The Wise Law <span className="text-slate-500 text-sm font-normal ml-2">ADMIN MODULE</span></span>
          </Link>
          <nav className="flex gap-4">
            <Link href="/insights" className="text-sm border border-slate-800 rounded-lg px-4 py-2 hover:bg-slate-900 transition-colors">
              인사이트 보드 구경하기
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Database className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">AI 리서치 딥다이브 트리거</h1>
          <p className="text-slate-400 leading-relaxed">
            분석을 원하는 사건의 개요, 기사, 또는 판례 전문을 아래에 붙여넣으세요. <br />
            이곳에서 "전송" 버튼을 누르는 즉시 뒤단에서 <strong className="text-slate-300">n8n 파이프라인</strong>이 가동되어 십자포화 서치를 시작합니다.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <form className="relative" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  리서치 제목 (가제)
                </label>
                <input 
                  type="text" 
                  name="title"
                  required
                  placeholder="예: 최신 전세사기 대법원 판례 분석" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-500" />
                  분석 모드 (카테고리)
                </label>
                <select 
                  name="category"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                >
                  <option value="법률">⚖️ 법률 모드 (전문/판례 중심 서치)</option>
                  <option value="일반">🌐 일반 모드 (뉴스/블로그 폭넓은 서치)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-medium text-slate-300 flex justify-between items-center">
                <span>분석할 내용 (텍스트/사건 개요/기사 스크랩)</span>
                <span className="text-xs text-slate-500">최대 20,000자 지원</span>
              </label>
              <textarea 
                name="researchText"
                required
                rows={12}
                placeholder="분석을 원하시는 내용을 통째로 복사해서 이곳에 붙여넣으세요. LLM이 맥락을 파악하고 스스로 검색 키워드를 도출해 냅니다."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-y font-mono text-sm leading-relaxed"
              ></textarea>
            </div>

            {status === 'success' && (
              <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-emerald-400">데이터 전송 완료!</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    입력하신 내용이 성공적으로 백엔드로 전송되었습니다. n8n 워크플로우가 작성 중이며, 완료 시 인사이트 보드에 자동 업로드됩니다.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-400">전송 실패</h4>
                  <p className="text-sm text-slate-400 mt-1">일시적인 네트워크 오류가 발생했습니다. 다시 시도해 주세요.</p>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>AI 데이터망 전송 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  <span>n8n 워크플로우 실행하기 (Trigger Data)</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Database, AlertCircle, CheckCircle2, Search, FileText, Send, Crown } from 'lucide-react'

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')

    const formData = new FormData(e.currentTarget)
    const payload = {
      title: formData.get('title'),
      category: formData.get('category'),
      text: formData.get('researchText'),
    }

    try {
      // TODO: n8n webhook 호출
      console.log('n8n 트리거로 전송될 페이로드:', payload)
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
    <div className="bg-[#050505] text-slate-200">
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-12 text-center">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <Crown className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">AI 리서치 <span className="text-amber-500">통제 센터</span></h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            대표님 전용 프라이빗 리서치 공간입니다. 분석을 원하는 사건의 개요, 기사, 혹은 판례 전문을 붙여넣고 즉시 실행하세요.
          </p>
          
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/insights" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-700 hover:border-amber-500 hover:text-amber-400 text-slate-300 transition-all rounded-full text-sm font-medium shadow-lg">
              <Database className="w-4 h-4" />
              과거 분석된 리서치(인사이트) 보드 바로가기
            </Link>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-10 backdrop-blur-sm relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <form className="relative" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  리서치 제목 (가제)
                </label>
                <input 
                  type="text" 
                  name="title"
                  required
                  placeholder="예: 최신 전세사기 대법원 판례 분석" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-500" />
                  분석 모드 (카테고리)
                </label>
                <select 
                  name="category"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="법률">⚖️ 법률 모드 (전문/판례 중심 서치)</option>
                  <option value="일반">🌐 일반 모드 (뉴스/블로그 폭넓은 서치)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 mb-10">
              <label className="text-sm font-medium text-slate-300 flex justify-between items-center">
                <span>분석할 내용 (텍스트/사건 개요/기사 스크랩)</span>
                <span className="text-xs text-slate-500">최대 20,000자 지원</span>
              </label>
              <textarea 
                name="researchText"
                required
                rows={12}
                placeholder="여기에 통째로 복사해서 붙여넣으세요. LLM이 맥락을 파악하고 스스로 깊이 파고들 검색 키워드를 도출해 냅니다."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all resize-y font-mono text-sm leading-relaxed"
              ></textarea>
            </div>

            {status === 'success' && (
              <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-emerald-400">데이터 전송 완료!</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    n8n 워크플로우가 분석을 시작하며, 완료 시 자동으로 인사이트 보드에 업로드됩니다.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-400">전송 실패</h4>
                  <p className="text-sm text-slate-400 mt-1">네트워크 오류가 발생했습니다. 다시 시도해 주세요.</p>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>AI 딥다이브 가동 중...</span>
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

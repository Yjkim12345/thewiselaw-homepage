'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Send, FileText, CheckCircle2, AlertCircle, Clock, BookOpen, ChevronRight } from 'lucide-react'

// types
type Report = {
  id: string
  title: string
  category: string
  summary: string
  created_at: string
}

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [reports, setReports] = useState<Report[]>([])
  const [isLoadingReports, setIsLoadingReports] = useState(true)

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
    fetchReports()
  }, [])

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
      console.log('Webhook Payload:', payload)
      await new Promise(resolve => setTimeout(resolve, 1000))
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 h-screen flex flex-col">
        
        {/* 상단 1/4: 심플한 입력창 */}
        <div className="bg-white border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl p-6 mb-8 shrink-0">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-sm inline-block"></span>
              AI Research Trigger
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-5">
            <div className="flex-1 space-y-4">
              <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                <input 
                  type="text" 
                  name="title"
                  required
                  placeholder="분석 제목 (예: 판례 2023다1234 분석)" 
                  className="xl:w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                
                {/* 라디오 버튼 그룹: 분석 모드 */}
                <div className="flex items-center gap-5 text-sm font-semibold text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-xs hidden sm:inline-block">분석 모드:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
                    <input type="radio" name="category" value="일반모드" defaultChecked className="accent-blue-600 w-4 h-4 cursor-pointer" />
                    🌐 일반모드
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
                    <input type="radio" name="category" value="법률일반혼합" className="accent-blue-600 w-4 h-4 cursor-pointer" />
                    ⚖️+🌐 법률일반혼합
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
                    <input type="radio" name="category" value="법률전용" className="accent-blue-600 w-4 h-4 cursor-pointer" />
                    ⚖️ 법률전용
                  </label>
                </div>
              </div>

              <textarea 
                name="researchText"
                required
                rows={3}
                placeholder="여기에 판례나 기사 등 원문 데이터를 자유롭게 붙여넣으세요. LLM이 맥락을 스스로 파악합니다."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y"
              ></textarea>
            </div>

            <div className="md:w-36 flex flex-col gap-3 shrink-0">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm shadow-blue-600/20"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    실행 (RUN)
                  </>
                )}
              </button>
              
              {status === 'success' && (
                <div className="text-[11px] font-bold text-center flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 전송 성공
                </div>
              )}
              {status === 'error' && (
                <div className="text-[11px] font-bold text-center flex items-center justify-center gap-1 py-1.5 px-2 bg-red-50 text-red-600 rounded-lg border border-red-100">
                  <AlertCircle className="w-3.5 h-3.5" /> 통신 오류
                </div>
              )}
            </div>
          </form>
        </div>

        {/* 하단 3/4: 출력 결과물 (인사이트 보드) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6">
          <div className="flex items-center justify-between mb-6 shrink-0 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-400" />
              분석 결과 리포트
            </h2>
            <button onClick={fetchReports} className="text-[13px] font-bold text-slate-400 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1">
              새로고침
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            {isLoadingReports ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                데이터를 불러오는 중입니다...
              </div>
            ) : reports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {reports.map((report) => (
                  <Link key={report.id} href={`/insights/${report.id}`}>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md hover:-translate-y-1 transition-all h-full flex flex-col cursor-pointer group">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold tracking-tight ${
                          report.category.includes('법률') 
                            ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {report.category}
                        </span>
                        <div className="flex items-center text-slate-400/80 text-[11px] font-bold tracking-wider">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <h3 className="text-[15px] text-slate-800 font-bold leading-snug mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {report.title}
                      </h3>
                      
                      <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                        {report.summary || '상세 보기를 클릭하여 전체 내용을 확인하세요.'}
                      </p>

                      <div className="mt-auto flex justify-end">
                        <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors text-slate-400">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center rounded-xl bg-slate-50/50">
                <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-500 mb-1">앗, 아직 도착한 분석 보고서가 없습니다.</p>
                <p className="text-xs font-medium text-slate-400">상단 입력창에서 첫 번째 리서치를 트리거해보세요!</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}

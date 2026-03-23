'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, FileText, CheckCircle2, AlertCircle, Clock, BookOpen, ChevronRight, Lock } from 'lucide-react'

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple client-side protection for demo purposes
    if (password === 'admin123!') {
      setIsAuthenticated(true)
      // Save to session storage so they don't have to login every refresh
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
    // Load saved webhook URL if exists
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
      alert('n8n Webhook URL을 먼저 입력해주세요!')
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
      // POST request to n8n Webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Webhook failed')

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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center mb-6 text-slate-800">관리자 로그인</h1>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
            접속하기
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 h-screen flex flex-col">
        
        {/* 상단: 웹훅 설정 & 리서치 트리거 */}
        <div className="bg-white border text-left border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl p-6 mb-8 shrink-0">
          <div className="flex flex-col md:flex-row justify-between md:items-center pb-5 mb-5 border-b border-slate-100 gap-4">
            <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              관리자 전용 AI 리서치 트리거
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">n8n Webhook URL:</span>
              <input 
                type="text" 
                value={webhookUrl}
                onChange={handleWebhookChange}
                placeholder="https://.../webhook-test/deep-research" 
                className="w-full md:w-[350px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-blue-500"
              />
            </div>
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
                
                <div className="flex items-center gap-5 text-sm font-semibold text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-xs hidden sm:inline-block">분석 카테고리:</span>
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
                placeholder="여기에 판례나 기사 등 원문 데이터를 자유롭게 붙여넣으세요. LLM이 맥락을 스스로 파악하여 n8n 파이프라인으로 전송합니다."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y"
              ></textarea>
            </div>

            <div className="md:w-36 flex flex-col gap-3 shrink-0">
              <button 
                type="submit"
                disabled={isSubmitting || !webhookUrl}
                className="flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm shadow-blue-600/20"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    n8n 전송
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

        {/* 관리자 데이터 보드 */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6">
          <div className="flex items-center justify-between mb-6 shrink-0 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-400" />
              전체 발행된 AI 리포트 현황
            </h2>
            <button onClick={fetchReports} className="text-[13px] font-bold text-slate-400 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1">
              새로고침
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {reports.map((report) => (
                <div key={report.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 transition-all h-full flex flex-col group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold tracking-tight bg-slate-100 text-slate-700">
                      {report.category}
                    </span>
                    <div className="flex items-center text-slate-400 text-[11px] font-bold tracking-wider">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h3 className="text-[15px] text-slate-800 font-bold leading-snug mb-3 line-clamp-2">
                    {report.title}
                  </h3>
                  
                  <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                    {report.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

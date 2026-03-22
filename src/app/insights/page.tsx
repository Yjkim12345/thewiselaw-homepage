import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { BookOpen, Scale, ChevronRight, Clock } from 'lucide-react'

export const revalidate = 60 // 1분 단위 캐시 갱신

export default async function InsightsPage() {
  const { data: reports, error } = await supabase
    .from('research_reports')
    .select('id, title, category, summary, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reports:', error)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200">
      {/* Header / Nav (Simplified) */}
      <header className="border-b border-slate-800/50 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-lg tracking-tight text-white">The Wise Law</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">홈</Link>
            <Link href="/insights" className="text-amber-500 transition-colors">AI 심층분석 (Insights)</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            AI 심층분석 <span className="text-amber-500">인사이트</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            The Wise Law의 최첨단 AI가 밤낮없이 수집하고 분석한 법률 및 최신 트렌드 심층 보고서입니다. 데이터 기반의 압도적인 통찰력을 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports && reports.length > 0 ? (
            reports.map((report) => (
              <Link key={report.id} href={`/insights/${report.id}`}>
                <div className="group h-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/50 hover:border-amber-500/50 transition-all duration-300 flex flex-col cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide flex items-center gap-1.5 ${
                      report.category === '법률' 
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {report.category === '법률' ? <Scale className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                      {report.category}
                    </span>
                    <div className="flex items-center text-slate-500 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(report.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-amber-400 transition-colors">
                    {report.title}
                  </h2>
                  
                  <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {report.summary || '본문에서 심층 분석 내용을 확인하세요.'}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-amber-500 mt-auto">
                    보고서 열람하기
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-300 mb-2">작성된 분석 보고서가 없습니다.</h3>
              <p className="text-slate-500">조만간 AI 시스템에 의해 새로운 심층 보고서가 업데이트 될 예정입니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Clock, Globe, ArrowUpRight } from 'lucide-react'
import { notFound } from 'next/navigation'

export const revalidate = 60

export default async function InsightDetailPage({ params }: { params: { id: string } }) {
  const { data: report, error } = await supabase
    .from('research_reports')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !report) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors text-[13px] font-bold">
            <ArrowLeft className="w-4 h-4" />
            통제 센터로 돌아가기
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white border border-slate-200 shadow-[0_2px_15px_-3px_rgba(6,81,237,0.05)] rounded-3xl p-8 md:p-12">
          {/* Article Header */}
          <header className="mb-10 border-b border-slate-100 pb-10">
            <div className="flex items-center gap-4 mb-6">
              <span className={`px-3 py-1.5 rounded-lg text-[12px] font-extrabold tracking-wide ${
                report.category.includes('법률') 
                  ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                  : 'bg-blue-50 text-blue-700 border border-blue-100'
              }`}>
                {report.category}
              </span>
              <div className="flex items-center text-slate-400 text-[13px] font-bold">
                <Clock className="w-4 h-4 mr-1.5" />
                {new Date(report.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
              {report.title}
            </h1>

            {report.summary && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  Executive Summary
                </h3>
                <p className="text-[15px] text-slate-700 leading-relaxed font-semibold">
                  {report.summary}
                </p>
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-strong:text-slate-900 prose-strong:font-bold prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:px-6 prose-blockquote:py-3 prose-blockquote:rounded-r-xl prose-blockquote:font-medium prose-blockquote:text-slate-700 prose-p:text-slate-600 prose-p:leading-loose text-[15px]">
            {report.content.split('\n').map((paragraph: string, idx: number) => {
              if (paragraph.startsWith('###')) {
                return <h3 key={idx} className="text-xl mt-10 mb-4">{paragraph.replace('###', '').trim()}</h3>
              } else if (paragraph.startsWith('##')) {
                return <h2 key={idx} className="text-2xl mt-12 mb-5">{paragraph.replace('##', '').trim()}</h2>
              } else if (paragraph.startsWith('#')) {
                return <h1 key={idx} className="text-3xl mt-14 mb-6">{paragraph.replace('#', '').trim()}</h1>
              } else if (paragraph.trim() === '') {
                return <br key={idx} />
              } else if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                return <li key={idx} className="ml-4 mb-2">{paragraph.replace(/^[-*]\s/, '')}</li>
              }
              return <p key={idx} className="mb-5">{paragraph}</p>
            })}
          </div>

          {/* Source URL Footer */}
          {report.source_url && (
            <div className="mt-16 pt-8 border-t border-slate-100">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">원문 출처 링크</h4>
              <a 
                href={report.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all text-[13px] font-bold shadow-sm"
              >
                <Globe className="w-4 h-4" />
                {new URL(report.source_url).hostname || '출처 링크로 이동'}
                <ArrowUpRight className="w-4 h-4 ml-1 text-slate-400" />
              </a>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}

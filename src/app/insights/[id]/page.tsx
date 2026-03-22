import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Scale, BookOpen, Clock, Globe, ArrowUpRight } from 'lucide-react'
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
    <div className="min-h-screen bg-[#050505] text-slate-200">
      <header className="border-b border-slate-800/50 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/insights" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </Link>
          <div className="font-semibold text-white flex items-center gap-2 tracking-tight">
            <Scale className="w-4 h-4 text-amber-500" />
            The Wise Law
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <article>
          {/* Article Header */}
          <header className="mb-12 border-b border-slate-800/50 pb-10">
            <div className="flex items-center gap-4 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium tracking-wide flex items-center gap-1.5 ${
                report.category === '법률' 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {report.category === '법률' ? <Scale className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                {report.category}
              </span>
              <div className="flex items-center text-slate-500 text-sm">
                <Clock className="w-4 h-4 mr-1.5" />
                {new Date(report.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight tracking-tight">
              {report.title}
            </h1>

            {report.summary && (
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 md:p-8">
                <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Executive Summary
                </h3>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                  {report.summary}
                </p>
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-amber-500 hover:prose-a:text-amber-400 prose-strong:text-white prose-strong:font-bold prose-blockquote:border-l-amber-500 prose-blockquote:bg-slate-900/30 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-p:text-slate-300 prose-p:leading-relaxed">
            {/* 임시 렌더링. 추후 react-markdown 등으로 처리 가능 */}
            {report.content.split('\n').map((paragraph: string, idx: number) => {
              if (paragraph.startsWith('###')) {
                return <h3 key={idx} className="text-2xl font-bold mt-10 mb-4">{paragraph.replace('###', '').trim()}</h3>
              } else if (paragraph.startsWith('##')) {
                return <h2 key={idx} className="text-3xl font-bold mt-12 mb-6 text-amber-500">{paragraph.replace('##', '').trim()}</h2>
              } else if (paragraph.startsWith('#')) {
                return <h1 key={idx} className="text-4xl font-bold mt-14 mb-8">{paragraph.replace('#', '').trim()}</h1>
              } else if (paragraph.trim() === '') {
                return <br key={idx} />
              } else if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                return <li key={idx} className="ml-4 mb-2">{paragraph.replace(/^[-*]\s/, '')}</li>
              }
              return <p key={idx} className="mb-4">{paragraph}</p>
            })}
          </div>

          {/* Source URL Footer */}
          {report.source_url && (
            <div className="mt-16 pt-8 border-t border-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">원문 출처 빛 참고 자료</h4>
              <a 
                href={report.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all text-sm"
              >
                <Globe className="w-4 h-4" />
                {new URL(report.source_url).hostname || '출처 링크로 이동'}
                <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-slate-500" />
              </a>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}

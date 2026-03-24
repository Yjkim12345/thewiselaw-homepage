import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Clock, Globe, ArrowUpRight, Scale, BookOpen, Layers } from 'lucide-react'
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

  // 간단한 마크다운 파서 및 목차(TOC) 추출
  const headings: { id: string, text: string, level: number }[] = [];
  const lines = report.content.split('\n');
  
  const renderedContent = lines.map((line: string, idx: number) => {
    const match = line.match(/^(#{1,3})\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = `heading-${idx}`;
      headings.push({ id, text, level });
      
      const Tag = `h${level}` as any;
      const className = 
        level === 1 ? 'text-3xl md:text-4xl mt-16 mb-8 font-extrabold text-white tracking-tight' : 
        level === 2 ? 'text-2xl mt-14 mb-6 font-bold text-slate-100' : 
        'text-xl mt-10 mb-4 font-bold text-slate-200';
      return <Tag key={idx} id={id} className={className}>{text}</Tag>;
    } else if (line.trim() === '') {
      return <div key={idx} className="h-4"></div>;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      return <li key={idx} className="ml-6 mb-3 text-slate-300 list-disc">{line.replace(/^[-*]\s/, '')}</li>;
    }
    // 인용구 (Blockquote) 렌더링
    if (line.startsWith('> ')) {
       return (
         <blockquote key={idx} className="pl-6 py-2 my-6 border-l-4 border-amber-500 bg-amber-500/5 text-slate-200 italic rounded-r-lg">
           {line.replace(/^>\s/, '')}
         </blockquote>
       )
    }
    return <p key={idx} className="mb-6 text-slate-300 leading-[1.8] text-[16px] md:text-[17px] font-light">{line}</p>;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans relative selection:bg-amber-500/30">
      {/* Background Glow Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <header className="border-b border-slate-800/50 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/insights" className="flex items-center gap-2 text-slate-400 hover:text-amber-500 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            인사이트 라이브러리로 돌아가기
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-white">The Wise Law</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 relative">
        
        {/* Left Sidebar: Table of Contents (TOC) */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md">
            <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Table of Contents
            </h4>
            <nav className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {headings.map((h) => (
                <a 
                  key={h.id} 
                  href={`#${h.id}`}
                  className={`text-sm text-slate-400 hover:text-white transition-colors block line-clamp-2 ${
                    h.level === 1 ? 'font-bold mt-2' : 
                    h.level === 2 ? 'pl-3' : 'pl-6 text-xs'
                  }`}
                >
                  {h.text}
                </a>
              ))}
              {headings.length === 0 && (
                <span className="text-slate-500 text-sm">목차가 없습니다.</span>
              )}
            </nav>
          </div>
        </aside>

        {/* Center: Main Booklet Content */}
        <article className="flex-1 max-w-3xl lg:border-l lg:border-slate-800/50 lg:pl-12">
          {/* Article Header */}
          <header className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-extrabold tracking-wide flex items-center gap-1.5 ${
                report.category === '법률' 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {report.category === '법률' ? <Scale className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                {report.category}
              </span>
              <div className="flex items-center text-slate-500 text-sm font-medium">
                <Clock className="w-4 h-4 mr-1.5" />
                {new Date(report.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 leading-[1.15] tracking-tight">
              {report.title}
            </h1>

            {report.summary && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Executive Summary
                </h3>
                <p className="text-[16px] text-slate-300 leading-relaxed font-medium">
                  {report.summary}
                </p>
              </div>
            )}
          </header>

          {/* Rendered Content */}
          <div className="prose-container">
            {renderedContent}
          </div>

          {/* Source URL Footer */}
          {report.source_url && (
            <div className="mt-24 pt-10 border-t border-slate-800/50">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-5">원문 출처 링크</h4>
              <a 
                href={report.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all text-sm font-semibold shadow-lg"
              >
                <Globe className="w-4 h-4" />
                {new URL(report.source_url).hostname || '출처 링크로 이동'}
                <ArrowUpRight className="w-4 h-4 ml-1 text-slate-500" />
              </a>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}

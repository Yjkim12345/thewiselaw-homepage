import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Scale, ShieldCheck, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/10 to-background/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-medium text-accent mb-8">
            <span className="flex h-2 w-2 rounded-full bg-accent mr-2"></span>
            AI 기반 데이터 분석을 통한 정밀한 법률 서비스
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            당신의 권리를 지키는 <br className="hidden md:block"/>
            <span className="text-accent">가장 지혜로운 선택</span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            수만 건의 판례와 최첨단 AI 기술, 그리고 전문 변호사의 통찰력이 만나 
            가장 확실하고 안전한 법률 솔루션을 제공합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-base" asChild>
              <Link href="/contact">상담 예약하기</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base" asChild>
              <Link href="/practice-areas">업무 분야 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Metrics Section */}
      <section className="py-12 bg-primary/5 border-y border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">98%</div>
              <div className="text-sm text-gray-400">승소율 및 조정 성사율</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">5,000+</div>
              <div className="text-sm text-gray-400">누적 상담 건수</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">15년</div>
              <div className="text-sm text-gray-400">평균 법조 경력</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <div className="text-sm text-gray-400">AI 기반 데이터 분석</div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas Highlights */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">전문 업무 분야</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              더와이즈는 각 분야의 고도화된 전문성을 바탕으로 빈틈없는 법률 서비스를 실현합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 text-accent">
                  <Scale className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">민사/손해배상</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  계약 분쟁, 불법행위로 인한 손해배상 등 복잡한 민사 사건에서 의뢰인의 정당한 권리와 재산을 되찾아 드립니다.
                </p>
                <Link href="/practice-areas#civil" className="text-accent hover:underline inline-flex items-center text-sm font-medium">
                  자세히 보기 <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 text-accent">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">형사/디지털 범죄</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  억울한 혐의 방어부터 디지털 증거 분석을 통한 치밀한 대응까지, 초기 단계부터 확실한 방어막을 구축합니다.
                </p>
                <Link href="/practice-areas#criminal" className="text-accent hover:underline inline-flex items-center text-sm font-medium">
                  자세히 보기 <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 text-accent">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">부동산/건설</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  재개발, 재건축, 부동산 PF 등 막대한 자본이 이동하는 영역에서 정확한 리스크 진단과 솔루션을 제시합니다.
                </p>
                <Link href="/practice-areas#realestate" className="text-accent hover:underline inline-flex items-center text-sm font-medium">
                  자세히 보기 <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" asChild>
              <Link href="/practice-areas">모든 업무 분야 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Lex-Pipeline Feature */}
      <section className="py-24 bg-gradient-to-br from-background via-background to-primary/10 border-t border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                압도적 승소율의 비밀,<br/>
                <span className="text-accent">AI 판례 분석 시스템</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                더와이즈는 자체 개발한 'Lex-Pipeline' AI 시스템을 통해 수만 건의 판례와 법령을 실시간으로 분석합니다. 인간의 한계를 넘는 데이터 처리 능력으로 숨겨진 승소 전략을 찾아냅니다.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-accent mr-3 shrink-0" />
                  <span className="text-gray-300">유사 판례 99% 매칭으로 정확한 승소 가능성 예측</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-accent mr-3 shrink-0" />
                  <span className="text-gray-300">실시간 변화하는 법령 및 판례 자동 추적 시스템</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-accent mr-3 shrink-0" />
                  <span className="text-gray-300">법원별, 판사별 성향에 맞춘 최적화된 변론 전략 수립</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square md:aspect-video lg:aspect-square rounded-2xl bg-glass-bg border border-glass-border p-8 shadow-2xl overflow-hidden relative">
                <div className="relative z-10 font-mono text-sm text-accent/80 space-y-2 h-full flex flex-col justify-end">
                  <p>&gt; Initializing Lex-Pipeline Worker...</p>
                  <p>&gt; Scanning latest Supreme Court precedents...</p>
                  <p>&gt; Found 3,421 matching cases for property law.</p>
                  <p className="text-green-400">&gt; NLP Analysis Complete. Optimal strategy generated.</p>
                  <div className="w-full h-1 bg-gray-800 mt-4 overflow-hidden rounded-full">
                    <div className="w-full h-full bg-accent animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

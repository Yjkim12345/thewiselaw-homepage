import { Scale, Milestone, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">법률사무소 소개</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          더와이즈는 AI 기술과 최고 수준의 법률 전문성을 결합하여 
          이전에 없던 새로운 차원의 법률 서비스를 제공합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
        <div className="text-center p-6 bg-glass-bg border border-glass-border rounded-xl">
          <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
            <Scale className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-4">정의와 형평성</h3>
          <p className="text-gray-400">어떤 상황에서도 의뢰인의 정당한 권리를 지키며, 법의 테두리 안에서 최선의 결과를 도출합니다.</p>
        </div>
        <div className="text-center p-6 bg-glass-bg border border-glass-border rounded-xl">
          <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
            <Milestone className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-4">미래 지향적 접근</h3>
          <p className="text-gray-400">자체 개발한 AI 'Lex-Pipeline'을 통해 인간의 한계를 넘는 데이터 분석으로 승소 확률을 극대화합니다.</p>
        </div>
        <div className="text-center p-6 bg-glass-bg border border-glass-border rounded-xl">
          <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
            <Award className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-4">입증된 전문성</h3>
          <p className="text-gray-400">대형 로펌 및 사내 변호사 출신의 핵심 인력들이 각자의 분야에서 탁월한 성과를 만들어냅니다.</p>
        </div>
      </div>

      <div className="bg-primary/5 border border-glass-border rounded-2xl p-8 md:p-12 mb-24">
        <h2 className="text-3xl font-bold mb-8 border-b border-glass-border pb-4">대표 변호사</h2>
        <div className="flex flex-col flex-col-reverse md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold text-accent">김와이즈 <span className="text-lg text-gray-400 ml-2">대표 변호사</span></h3>
            <p className="text-gray-300 leading-relaxed">
              "법은 누구에게나 평등해야 하지만, 그 결과를 이끌어내는 과정은 변호사의 역량에 따라 완전히 달라집니다. 더와이즈는 첨단 기술과 치밀한 법리를 무기로 의뢰인의 가장 든든한 방패가 되겠습니다."
            </p>
            <ul className="text-gray-400 space-y-2 mt-6">
              <li>- 서울대학교 법과대학 졸업</li>
              <li>- 제50회 사법시험 합격, 사법연수원 40기</li>
              <li>- 전) 대형로펌 태평양 기업법무팀 파트너</li>
              <li>- 현) 더와이즈 법률사무소 대표 변호사</li>
            </ul>
          </div>
          <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-800 rounded-xl overflow-hidden shadow-2xl shrink-0">
             {/* Replace with actual image later */}
             <div className="w-full h-full bg-gradient-to-tr from-primary/40 to-background flex items-center justify-center text-gray-600">
               [Photo Placeholder]
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

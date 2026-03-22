import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function PracticeAreasPage() {
  const areas = [
    {
      id: "civil",
      title: "민사 및 손해배상",
      desc: "계약 위반, 불법행위로 인한 손해배상, 부당이득 반환 등 각종 민사 분쟁에서 치밀한 사실관계 분석과 법리 구성을 통해 의뢰인의 재산권을 완벽하게 보호합니다."
    },
    {
      id: "criminal",
      title: "형사 방어 및 고소",
      desc: "수사 초기 단계부터 공판에 이르기까지 전방위적인 밀착 대응을 제공합니다. 특히 경제 범죄, 디지털 성범죄 등 첨단화된 범죄 유형에 대한 독보적인 방어 노하우를 보유하고 있습니다."
    },
    {
      id: "realestate",
      title: "부동산 및 건설",
      desc: "PF 분쟁, 재개발/재건축, 임대차 분쟁 등 이해관계가 복잡하게 얽힌 부동산 사건에서 정확한 리스크 진단과 협상력으로 최선의 결과를 도출합니다."
    },
    {
      id: "corporate",
      title: "기업 법무 및 자문",
      desc: "스타트업 자문부터 중견기업의 M&A, 컴플라이언스 구축까지 기업 운영 전반에 걸친 법적 리스크를 선제적으로 차단하고 성장을 지원합니다."
    },
    {
      id: "ai-tech",
      title: "AI & 신기술 규제",
      desc: "AI, 블록체인, 플랫폼 비즈니스 등 새로운 기술과 관련된 법률적 회색지대(Gray Zone)에서 혁신을 가로막지 않는 최적의 합법적 비즈니스 모델을 설계합니다."
    },
    {
      id: "family",
      title: "가사 및 상속",
      desc: "이혼, 재산분할, 양육권, 거액의 상속 분쟁 등 예민한 가족 간의 갈등을 최대한 조용하고 유리하게 마무리할 수 있도록 세심하게 지원합니다."
    }
  ];

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">전문 업무 분야</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          폭넓은 스펙트럼의 전문성을 바탕으로, 
          어떤 복잡한 사건이라도 가장 명쾌한 법률적 해답을 제시합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {areas.map(area => (
          <Card key={area.id} id={area.id} className="scroll-mt-24 h-full">
            <CardHeader>
              <CardTitle className="text-2xl text-accent">{area.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                {area.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-glass-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Scale className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold tracking-tight">The Wise Law</span>
            </Link>
            <p className="text-sm text-gray-400 mt-4 max-w-sm">
              지혜로운 법률사무소는 첨단 AI 기술과 축적된 법률 전문성을 결합하여 
              의뢰인에게 최적의 솔루션을 제공합니다.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">바로가기</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-accent transition-colors">법률사무소 소개</Link></li>
              <li><Link href="/practice-areas" className="text-sm text-gray-400 hover:text-accent transition-colors">업무 분야</Link></li>
              <li><Link href="/insights" className="text-sm text-gray-400 hover:text-accent transition-colors">승소 사례</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">고객 센터</h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-400">전화: 02-123-4567</li>
              <li className="text-sm text-gray-400">이메일: contact@thewiselaw.co.kr</li>
              <li className="text-sm text-gray-400">주소: 서울특별시 서초구 서초대로 123</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-glass-border text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} The Wise Law. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

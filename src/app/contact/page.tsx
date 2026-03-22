"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "",
    message: "",
    privacy: false
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacy) {
      setErrorMessage("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }
    if (!formData.name || !formData.phone || !formData.message) {
      setErrorMessage("이름, 연락처, 상담 내용은 필수 입력 항목입니다.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }

      setStatus("success");
      setFormData({ name: "", phone: "", email: "", category: "", message: "", privacy: false });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "오류가 발생했습니다.");
    }
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">상담 문의</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          가장 빠르고 정확한 조력을 위해 지금 바로 연락주세요. 
          더와이즈의 전문 변호사가 직접 답변해 드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">오시는 길</h2>
            <Card className="bg-glass-bg border-glass-border">
              <CardContent className="p-0">
                <div className="w-full h-64 bg-gray-800 rounded-t-xl flex items-center justify-center text-gray-500">
                  [현장 맵 API 연동 영역]
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-accent mt-0.5 mr-3 shrink-0" />
                    <p className="text-gray-300">서울특별시 서초구 서초대로 123, 더와이즈 타워 15층<br/><span className="text-sm text-gray-500">(교대역 1번 출구 도보 3분)</span></p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-accent mr-3 shrink-0" />
                    <p className="text-gray-300">02-123-4567</p>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-accent mr-3 shrink-0" />
                    <p className="text-gray-300">contact@thewiselaw.co.kr</p>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-accent mt-0.5 mr-3 shrink-0" />
                    <div className="text-gray-300">
                      <p>평일: 09:00 - 18:00</p>
                      <p className="text-sm border border-accent/30 bg-accent/10 text-accent px-2 py-0.5 rounded inline-block mt-1">야간/주말 상담은 사전 예약시 가능</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">실시간 온라인 문의</h2>
          <Card className="bg-glass-bg border-glass-border relative overflow-hidden">
            {status === "success" ? (
              <div className="absolute inset-0 z-10 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="h-20 w-20 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-4">상담이 성공적으로 접수되었습니다.</h3>
                <p className="text-gray-400 mb-8 max-w-sm">남겨주신 내용을 변호사가 면밀히 검토한 후, 빠른 시일 내에 기재해주신 연락처로 회신 드리겠습니다.</p>
                <Button onClick={() => setStatus("idle")} variant="outline">새로운 상담 접수하기</Button>
              </div>
            ) : null}

            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-300">이름 *</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full bg-background border border-glass-border rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent" placeholder="홍길동" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-300">연락처 *</label>
                    <input type="text" id="phone" value={formData.phone} onChange={handleChange} className="w-full bg-background border border-glass-border rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent" placeholder="010-0000-0000" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">이메일</label>
                  <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full bg-background border border-glass-border rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent" placeholder="example@email.com" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-gray-300">상담 분야</label>
                  <select id="category" value={formData.category} onChange={handleChange} className="w-full bg-background border border-glass-border rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent">
                    <option value="" disabled>선택해주세요</option>
                    <option value="civil">민사/손해배상</option>
                    <option value="criminal">형사/디지털범죄</option>
                    <option value="realestate">부동산/건설</option>
                    <option value="corporate">기업법무</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-300">상담 내용 *</label>
                  <textarea id="message" value={formData.message} onChange={handleChange} rows={5} className="w-full bg-background border border-glass-border rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none" placeholder="간략한 사실관계와 궁금하신 점을 남겨주시면 변호사가 내용 검토 후 연락드립니다." required></textarea>
                </div>

                <div className="flex items-start">
                  <input type="checkbox" id="privacy" checked={formData.privacy} onChange={handleChange} className="mt-1 h-4 w-4 bg-background border-glass-border rounded text-accent focus:ring-accent cursor-pointer" />
                  <label htmlFor="privacy" className="ml-2 text-sm text-gray-400 cursor-pointer">
                    개인정보 수집 및 이용에 동의합니다. <span className="text-red-400">*</span><br/>
                    (수집된 정보는 상담 목적으로만 사용되며 엄격히 비밀유지됩니다.)
                  </label>
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                )}

                <Button type="submit" size="lg" className="w-full text-base font-bold" disabled={status === "loading"}>
                  {status === "loading" ? "전송 중..." : "상담 접수하기"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

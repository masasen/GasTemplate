import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Rocket, Calendar } from "lucide-react";

export default function CTA() {
  const stats = [
    { value: "5分", label: "設定完了時間" },
    { value: "1,000+", label: "利用ユーザー数" },
    { value: "98%", label: "満足度" },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary via-indigo-600 to-purple-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              今すぐ業務効率化を始めませんか？
            </h2>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              無料プランでも十分な機能をご利用いただけます。まずはお気軽にお試しください。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generator">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-50 transform hover:scale-105 transition-all duration-200 shadow-lg">
                <Rocket className="w-5 h-5 mr-2" />
                無料で始める
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-200">
              <Calendar className="w-5 h-5 mr-2" />
              デモを予約
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-indigo-400">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

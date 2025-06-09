import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Edit, Rocket, Building, User, ShoppingCart, Code, Table, Book, CheckCircle, Play } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: FileText,
      title: "テンプレート選択",
      description: "見積書、注文書、請求書から必要な文書タイプを選択します。",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      features: [
        { icon: CheckCircle, text: "見積書（シンプル・詳細）" },
        { icon: CheckCircle, text: "注文書（商品・サービス）" },
        { icon: CheckCircle, text: "請求書（月次・都度）" },
      ],
    },
    {
      number: 2,
      icon: Edit,
      title: "情報入力",
      description: "会社情報や顧客情報を直感的なフォームに入力します。",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      features: [
        { icon: Building, text: "会社情報・ロゴ", color: "text-blue-500" },
        { icon: User, text: "顧客情報・連絡先", color: "text-green-500" },
        { icon: ShoppingCart, text: "商品・サービス明細", color: "text-amber-500" },
      ],
    },
    {
      number: 3,
      icon: Rocket,
      title: "自動生成",
      description: "GASコードが自動生成され、ワンクリックでコピー完了です。",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      features: [
        { icon: Code, text: "カスタムGASコード", color: "text-purple-500" },
        { icon: Table, text: "スプレッドシートテンプレート", color: "text-cyan-500" },
        { icon: Book, text: "設定手順書", color: "text-indigo-500" },
      ],
    },
  ];

  return (
    <section id="guide" className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
            <span className="text-primary">3ステップ</span>で完了
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            難しい操作は一切ありません。誰でも簡単に自動化を実現できます。
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="absolute -top-4 left-8">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div className="pt-4">
                      <div className={`w-16 h-16 ${step.iconBg} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                        <StepIcon className={`${step.iconColor} w-8 h-8`} />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 text-center mb-6">
                        {step.description}
                      </p>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-sm text-slate-500 mb-2">
                          {index === 0 ? "選択可能なテンプレート" : index === 1 ? "入力項目例" : "生成される内容"}
                        </div>
                        <div className="space-y-2">
                          {step.features.map((feature, featureIndex) => {
                            const FeatureIcon = feature.icon;
                            return (
                              <div key={featureIndex} className="flex items-center text-sm">
                                <FeatureIcon className={`w-4 h-4 mr-2 ${feature.color || "text-success"}`} />
                                {feature.text}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/generator">
            <Button size="lg" className="bg-primary text-white hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              <Play className="w-5 h-5 mr-2" />
              今すぐ試してみる
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

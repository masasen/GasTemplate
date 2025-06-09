import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, 
  Table, 
  Copy, 
  GraduationCap, 
  Eye, 
  Smartphone,
  ArrowRight 
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Wand2,
      title: "自動生成機能",
      description: "テンプレートを選んで情報を入力するだけ。見積書、注文書、請求書が自動で作成されます。",
      color: "blue",
      gradient: "from-blue-50 to-indigo-50",
      border: "border-blue-100",
      iconBg: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      icon: Table,
      title: "スプレッドシート連携",
      description: "Googleスプレッドシートと完全連携。既存のデータを活用して効率的に文書作成。",
      color: "green",
      gradient: "from-green-50 to-emerald-50",
      border: "border-green-100",
      iconBg: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      icon: Copy,
      title: "ワンクリックコピー",
      description: "生成されたGASコードをワンクリックでコピー。すぐにスプレッドシートで使用可能。",
      color: "amber",
      gradient: "from-amber-50 to-orange-50",
      border: "border-amber-100",
      iconBg: "bg-amber-500",
      textColor: "text-amber-600",
    },
    {
      icon: GraduationCap,
      title: "初心者ガイド",
      description: "ステップバイステップのチュートリアルで、初めての方でも安心して使用できます。",
      color: "purple",
      gradient: "from-purple-50 to-violet-50",
      border: "border-purple-100",
      iconBg: "bg-purple-500",
      textColor: "text-purple-600",
    },
    {
      icon: Eye,
      title: "プレビュー機能",
      description: "実行前に文書の仕上がりを確認。修正も簡単で、完璧な文書を作成できます。",
      color: "cyan",
      gradient: "from-cyan-50 to-blue-50",
      border: "border-cyan-100",
      iconBg: "bg-cyan-500",
      textColor: "text-cyan-600",
    },
    {
      icon: Smartphone,
      title: "モバイル対応",
      description: "スマートフォンやタブレットからも快適に操作。いつでもどこでも文書作成。",
      color: "rose",
      gradient: "from-rose-50 to-pink-50",
      border: "border-rose-100",
      iconBg: "bg-rose-500",
      textColor: "text-rose-600",
    },
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
            すべてが<span className="text-primary">簡単操作</span>で完了
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            複雑な設定は一切不要。直感的な操作で、あなたの業務を劇的に効率化します。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={`bg-gradient-to-br ${feature.gradient} ${feature.border} hover:shadow-lg transition-shadow cursor-pointer group`}
              >
                <CardContent className="p-8">
                  <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 mb-6">{feature.description}</p>
                  <div className={`flex items-center ${feature.textColor} font-medium group-hover:translate-x-1 transition-transform`}>
                    詳しく見る <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

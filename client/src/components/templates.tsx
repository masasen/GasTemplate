import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { File, ShoppingCart, Receipt, Handshake, Globe, PaintbrushVertical } from "lucide-react";
import { Link } from "wouter";

export default function Templates() {
  const templates = [
    {
      id: "simple-estimate",
      title: "シンプル見積書",
      icon: File,
      description: "必要最小限の項目で構成された、使いやすい見積書テンプレート",
      badge: { text: "人気", variant: "default" as const },
      gradient: "from-blue-50 to-indigo-100",
      border: "border-blue-200",
      iconGradient: "from-blue-100 to-blue-200",
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      price: "無料",
      priceColor: "text-blue-600",
    },
    {
      id: "detailed-order",
      title: "詳細注文書",
      icon: ShoppingCart,
      description: "商品詳細、数量、価格を詳細に記載できる注文書テンプレート",
      badge: { text: "推奨", variant: "secondary" as const },
      gradient: "from-green-50 to-emerald-100",
      border: "border-green-200",
      iconGradient: "from-green-100 to-green-200",
      iconColor: "text-green-600",
      buttonColor: "bg-green-500 hover:bg-green-600",
      price: "無料",
      priceColor: "text-green-600",
    },
    {
      id: "monthly-invoice",
      title: "月次請求書",
      icon: Receipt,
      description: "月次での請求に特化した、自動計算機能付きの請求書テンプレート",
      badge: { text: "新着", variant: "outline" as const },
      gradient: "from-amber-50 to-orange-100",
      border: "border-amber-200",
      iconGradient: "from-amber-100 to-amber-200",
      iconColor: "text-amber-600",
      buttonColor: "bg-amber-500 hover:bg-amber-600",
      price: "無料",
      priceColor: "text-amber-600",
    },
    {
      id: "service-estimate",
      title: "サービス見積書",
      icon: Handshake,
      description: "コンサルティングやサービス業に特化した見積書テンプレート",
      badge: { text: "Pro", variant: "destructive" as const },
      gradient: "from-purple-50 to-violet-100",
      border: "border-purple-200",
      iconGradient: "from-purple-100 to-purple-200",
      iconColor: "text-purple-600",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      price: "有料",
      priceColor: "text-purple-600",
    },
    {
      id: "multilingual",
      title: "多言語対応書類",
      icon: Globe,
      description: "日本語・英語対応の国際取引向け文書テンプレート",
      badge: { text: "特殊", variant: "secondary" as const },
      gradient: "from-cyan-50 to-blue-100",
      border: "border-cyan-200",
      iconGradient: "from-cyan-100 to-cyan-200",
      iconColor: "text-cyan-600",
      buttonColor: "bg-cyan-500 hover:bg-cyan-600",
      price: "有料",
      priceColor: "text-cyan-600",
    },
    {
      id: "custom",
      title: "カスタムテンプレート",
      icon: PaintbrushVertical,
      description: "あなたの業務に完全に合わせたオリジナルテンプレートを作成",
      badge: { text: "作成", variant: "outline" as const },
      gradient: "from-rose-50 to-pink-100",
      border: "border-rose-200",
      iconGradient: "from-rose-100 to-rose-200",
      iconColor: "text-rose-600",
      buttonColor: "bg-rose-500 hover:bg-rose-600",
      price: "要相談",
      priceColor: "text-rose-600",
    },
  ];

  return (
    <section id="templates" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
            豊富な<span className="text-primary">テンプレート</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            業種や用途に合わせて選べる、プロ仕様のテンプレートを多数ご用意しています。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => {
            const TemplateIcon = template.icon;
            return (
              <Card
                key={template.id}
                className={`bg-gradient-to-br ${template.gradient} ${template.border} hover:shadow-lg transition-shadow`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">{template.title}</h3>
                    <Badge variant={template.badge.variant} className="text-xs">
                      {template.badge.text}
                    </Badge>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <div className={`h-32 bg-gradient-to-br ${template.iconGradient} rounded-lg flex items-center justify-center`}>
                      <TemplateIcon className={`${template.iconColor} w-12 h-12`} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`${template.priceColor} font-medium`}>{template.price}</span>
                    <Link href={`/generator/${template.id}`}>
                      <Button size="sm" className={`${template.buttonColor} text-white transition-colors`}>
                        {template.price === "有料" || template.price === "要相談" ? "詳細を見る" : "使用する"}
                      </Button>
                    </Link>
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

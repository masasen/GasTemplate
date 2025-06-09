import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, ShoppingCart, Receipt } from "lucide-react";
import { Link } from "wouter";
import type { DocumentTemplate } from "@shared/schema";

export default function TemplateBuilder() {
  const [selectedType, setSelectedType] = useState<string>("all");

  const { data: templates, isLoading } = useQuery<DocumentTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const templateTypes = [
    { id: "all", name: "すべて", icon: FileText },
    { id: "estimate", name: "見積書", icon: FileText },
    { id: "order", name: "注文書", icon: ShoppingCart },
    { id: "invoice", name: "請求書", icon: Receipt },
  ];

  const filteredTemplates = templates?.filter(
    (template) => selectedType === "all" || template.type === selectedType
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">読み込み中...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
              テンプレート一覧
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              用途に合わせてテンプレートを選択し、カスタマイズしてください。
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            {templateTypes.map((type) => {
              const TypeIcon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  onClick={() => setSelectedType(type.id)}
                  className="flex items-center gap-2"
                >
                  <TypeIcon className="w-4 h-4" />
                  {type.name}
                </Button>
              );
            })}
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Template Card */}
            <Link href="/templates/create">
              <Card className="border-2 border-dashed border-slate-300 hover:border-primary transition-colors cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center mb-4 mx-auto transition-colors">
                    <Plus className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    新しいテンプレート
                  </h3>
                  <p className="text-sm text-slate-600">
                    カスタムテンプレートを作成
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Template Cards */}
            {filteredTemplates?.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary">
                      {template.type === "estimate" ? "見積書" : 
                       template.type === "order" ? "注文書" : "請求書"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    {template.description}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/generator/${template.id}`}>
                      <Button size="sm" className="flex-1">
                        使用する
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline">
                      プレビュー
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates?.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                テンプレートが見つかりません
              </h3>
              <p className="text-slate-600">
                別のカテゴリを選択するか、新しいテンプレートを作成してください。
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

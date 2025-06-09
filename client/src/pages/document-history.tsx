import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, Download } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { GeneratedDocument } from "@shared/schema";

export default function DocumentHistory() {
  const { data: documents, isLoading } = useQuery<GeneratedDocument[]>({
    queryKey: ["/api/generated"],
  });

  const getTemplateTypeBadge = (type: string) => {
    const typeMap = {
      estimate: { label: "見積書", variant: "secondary" as const },
      order: { label: "注文書", variant: "default" as const },
      invoice: { label: "請求書", variant: "destructive" as const },
    };
    return typeMap[type as keyof typeof typeMap] || { label: type, variant: "outline" as const };
  };

  const handleDownload = (document: GeneratedDocument) => {
    const blob = new Blob([document.generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `gas_code_${document.id}.js`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">履歴を読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          文書履歴
        </h1>
        <p className="text-slate-600">
          生成した文書とGASコードの履歴を確認できます
        </p>
      </div>

      {!documents || documents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              履歴がありません
            </h3>
            <p className="text-slate-600 mb-6">
              まだ文書を生成していません。テンプレートから新しい文書を作成してみましょう。
            </p>
            <Button onClick={() => window.location.href = "/templates"}>
              テンプレートを選択
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {documents.map((document) => {
            const companyInfo = document.companyInfo as any;
            const customerInfo = document.customerInfo as any;
            const items = document.items as any[];
            
            return (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-2">
                        {companyInfo?.name || "会社名未設定"} → {customerInfo?.name || "顧客名未設定"}
                      </CardTitle>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {document.createdAt ? format(new Date(document.createdAt), "yyyy年M月d日", { locale: ja }) : "日付不明"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {document.createdAt ? format(new Date(document.createdAt), "HH:mm") : "時刻不明"}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document)}
                      className="ml-4"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      GASコード
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">会社情報</h4>
                      <p className="text-slate-600">{companyInfo?.name}</p>
                      <p className="text-slate-500 text-xs">{companyInfo?.email}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">顧客情報</h4>
                      <p className="text-slate-600">{customerInfo?.name}</p>
                      <p className="text-slate-500 text-xs">{customerInfo?.email}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">項目数</h4>
                      <p className="text-slate-600">{items?.length || 0}件</p>
                      <p className="text-slate-500 text-xs">
                        合計: ¥{items?.reduce((sum, item) => sum + (item.total || 0), 0).toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
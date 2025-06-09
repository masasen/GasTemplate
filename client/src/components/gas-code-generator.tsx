import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, CheckCircle, Book, Code, FileSpreadsheet, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GasCodeGeneratorProps {
  generatedCode: string;
  instructions: string[];
}

export default function GasCodeGenerator({ generatedCode, instructions }: GasCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast({
        title: "コピー完了",
        description: "GASコードがクリップボードにコピーされました。",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "エラー",
        description: "コピーに失敗しました。",
        variant: "destructive",
      });
    }
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document-generator.gs";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="w-6 h-6 text-success" />
          <h2 className="text-2xl font-bold text-slate-900">GASコード生成完了</h2>
        </div>
        <p className="text-slate-600">
          以下のコードをGoogle Apps Scriptにコピーして使用してください。
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          生成されたコードは、お客様の入力データに基づいてカスタマイズされています。
          設定手順に従って、Google スプレッドシートで実行してください。
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="code">
            <Code className="w-4 h-4 mr-2" />
            GASコード
          </TabsTrigger>
          <TabsTrigger value="template">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            テンプレート
          </TabsTrigger>
          <TabsTrigger value="instructions">
            <Book className="w-4 h-4 mr-2" />
            設定手順
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Google Apps Script コード
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    {copied ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied ? "コピー済み" : "コピー"}
                  </Button>
                  <Button onClick={downloadCode} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    ダウンロード
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generatedCode}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Copy className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">ステップ 1</h3>
                <p className="text-sm text-slate-600">コードをコピー</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">ステップ 2</h3>
                <p className="text-sm text-slate-600">スプレッドシートに貼り付け</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">ステップ 3</h3>
                <p className="text-sm text-slate-600">実行して完了</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="template" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                スプレッドシートテンプレート
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">
                  以下のテンプレートを使用して、スプレッドシートを設定してください。
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">必要なシート構成:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                    <li>「設定」シート - 会社情報と顧客情報を入力</li>
                    <li>「商品明細」シート - 商品・サービスの詳細を入力</li>
                    <li>「出力」シート - 生成された文書が表示される</li>
                  </ul>
                </div>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  テンプレートファイルをダウンロード
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                設定手順
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ol className="space-y-4">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <Badge variant="outline" className="min-w-[2rem] h-6 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <p className="text-slate-700 leading-relaxed">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Book className="h-4 w-4" />
            <AlertDescription>
              問題が発生した場合は、ヘルプドキュメントを参照するか、サポートにお問い合わせください。
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}

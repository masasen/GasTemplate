import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, FileText, Settings, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DocumentTemplate, CompanyInfo, CustomerInfo, DocumentItem } from "@shared/schema";

interface PdfExportProps {
  template?: DocumentTemplate;
  companyInfo: CompanyInfo | null;
  customerInfo: CustomerInfo | null;
  items: DocumentItem[];
}

export default function PdfExport({ 
  template, 
  companyInfo, 
  customerInfo, 
  items 
}: PdfExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async () => {
    if (!companyInfo || !customerInfo || !items.length) {
      toast({
        title: "エラー",
        description: "すべての必須項目を入力してください。",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // PDF生成のロジック
      await generateDocumentPDF();
      
      toast({
        title: "PDF生成完了",
        description: "文書がPDF形式でダウンロードされました。",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "PDF生成に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDocumentPDF = async () => {
    if (!companyInfo || !customerInfo) return;
    
    // HTMLからPDFを生成する処理
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const currentDate = new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });

    const getDocumentTitle = () => {
      if (!template) return "文書";
      switch (template.type) {
        case "estimate": return "見積書";
        case "order": return "注文書"; 
        case "invoice": return "請求書";
        default: return "文書";
      }
    };

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${getDocumentTitle()}</title>
    <style>
        body { 
            font-family: 'Yu Gothic', 'Hiragino Sans', sans-serif; 
            margin: 20px; 
            color: #333;
            line-height: 1.6;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .header h1 { 
            font-size: 28px; 
            margin: 0; 
            color: #333;
        }
        .document-info { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 30px; 
        }
        .company-info, .customer-info { 
            width: 48%; 
        }
        .company-info h3, .customer-info h3 { 
            border-bottom: 1px solid #ccc; 
            padding-bottom: 5px; 
            margin-bottom: 10px;
            font-size: 16px;
        }
        .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px; 
        }
        .items-table th, .items-table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
        }
        .items-table th { 
            background-color: #f5f5f5; 
            font-weight: bold;
        }
        .items-table .number { 
            text-align: right; 
        }
        .total-section { 
            width: 300px; 
            margin-left: auto; 
            border: 1px solid #ddd;
            padding: 15px;
        }
        .total-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 5px; 
        }
        .total-row.final { 
            font-weight: bold; 
            font-size: 18px; 
            border-top: 2px solid #333; 
            padding-top: 10px;
            margin-top: 10px;
        }
        .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
            border-top: 1px solid #ccc;
            padding-top: 20px;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${getDocumentTitle()}</h1>
        <p>発行日: ${currentDate}</p>
    </div>
    
    <div class="document-info">
        <div class="company-info">
            <h3>発行者情報</h3>
            <p><strong>${companyInfo.name}</strong></p>
            <p>${companyInfo.address}</p>
            <p>TEL: ${companyInfo.phone}</p>
            <p>Email: ${companyInfo.email}</p>
            ${companyInfo.website ? `<p>Web: ${companyInfo.website}</p>` : ''}
        </div>
        
        <div class="customer-info">
            <h3>宛先</h3>
            <p><strong>${customerInfo.name} 様</strong></p>
            <p>${customerInfo.address}</p>
            ${customerInfo.phone ? `<p>TEL: ${customerInfo.phone}</p>` : ''}
            ${customerInfo.email ? `<p>Email: ${customerInfo.email}</p>` : ''}
            ${customerInfo.contactPerson ? `<p>担当者: ${customerInfo.contactPerson}</p>` : ''}
        </div>
    </div>
    
    <table class="items-table">
        <thead>
            <tr>
                <th>項目名</th>
                <th>説明</th>
                <th>数量</th>
                <th>単価</th>
                <th>金額</th>
            </tr>
        </thead>
        <tbody>
            ${items.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.description || '－'}</td>
                    <td class="number">${item.quantity.toLocaleString()}</td>
                    <td class="number">¥${item.unitPrice.toLocaleString()}</td>
                    <td class="number">¥${item.total.toLocaleString()}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="total-section">
        <div class="total-row">
            <span>小計</span>
            <span>¥${totalAmount.toLocaleString()}</span>
        </div>
        <div class="total-row">
            <span>消費税（10%）</span>
            <span>¥${Math.floor(totalAmount * 0.1).toLocaleString()}</span>
        </div>
        <div class="total-row final">
            <span>合計金額</span>
            <span>¥${Math.floor(totalAmount * 1.1).toLocaleString()}</span>
        </div>
    </div>
    
    <div class="footer">
        この文書は「GAS文書アシスタント」で生成されました。
    </div>
    
    <script>
        window.onload = function() {
            window.print();
            setTimeout(function() {
                window.close();
            }, 1000);
        };
    </script>
</body>
</html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const isDataValid = companyInfo && customerInfo && items.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!isDataValid}>
          <Download className="w-4 h-4 mr-2" />
          PDF出力
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            PDF出力
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              入力された情報を基に、印刷可能なPDF形式で文書を出力します。
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                出力設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>文書タイプ:</span>
                <span className="font-medium">
                  {template?.type === "estimate" ? "見積書" : 
                   template?.type === "order" ? "注文書" : "請求書"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>項目数:</span>
                <span className="font-medium">{items.length}件</span>
              </div>
              <div className="flex justify-between">
                <span>合計金額:</span>
                <span className="font-medium">
                  ¥{Math.floor(items.reduce((sum, item) => sum + item.total, 0) * 1.1).toLocaleString()}
                  <span className="text-xs text-slate-500 ml-1">(税込)</span>
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button 
              onClick={generatePDF} 
              disabled={!isDataValid || isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>処理中...</>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  PDF出力開始
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-slate-500">
            ※ ブラウザの印刷ダイアログが表示されます。PDFとして保存するには、出力先で「PDFに保存」を選択してください。
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
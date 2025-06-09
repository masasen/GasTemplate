import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { DocumentTemplate, CompanyInfo, CustomerInfo, DocumentItem } from "@shared/schema";

interface DocumentPreviewProps {
  template?: DocumentTemplate;
  companyInfo: CompanyInfo | null;
  customerInfo: CustomerInfo | null;
  items: DocumentItem[];
}

export default function DocumentPreview({ 
  template, 
  companyInfo, 
  customerInfo, 
  items 
}: DocumentPreviewProps) {
  if (!companyInfo || !customerInfo || !items.length) {
    return null;
  }

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

  const getDocumentNumber = () => {
    const prefix = template?.type === "estimate" ? "EST" : 
                   template?.type === "order" ? "ORD" : "INV";
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `${prefix}-${dateStr}-001`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Document Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {getDocumentTitle()}
            </h1>
            <Badge variant="outline" className="text-sm">
              {getDocumentNumber()}
            </Badge>
          </div>
          <div className="text-right text-sm text-slate-600">
            <div>発行日: {currentDate}</div>
          </div>
        </div>
      </div>

      {/* Company and Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Company Info */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-200">
            発行者情報
          </h3>
          <div className="space-y-1 text-sm">
            <div className="font-medium text-slate-900">{companyInfo.name}</div>
            <div className="text-slate-600 whitespace-pre-line">{companyInfo.address}</div>
            <div className="text-slate-600">TEL: {companyInfo.phone}</div>
            <div className="text-slate-600">Email: {companyInfo.email}</div>
            {companyInfo.website && (
              <div className="text-slate-600">Web: {companyInfo.website}</div>
            )}
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-200">
            宛先
          </h3>
          <div className="space-y-1 text-sm">
            <div className="font-medium text-slate-900">{customerInfo.name} 様</div>
            <div className="text-slate-600 whitespace-pre-line">{customerInfo.address}</div>
            {customerInfo.phone && (
              <div className="text-slate-600">TEL: {customerInfo.phone}</div>
            )}
            {customerInfo.email && (
              <div className="text-slate-600">Email: {customerInfo.email}</div>
            )}
            {customerInfo.contactPerson && (
              <div className="text-slate-600">担当者: {customerInfo.contactPerson}</div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="font-semibold text-slate-900 mb-4">明細</h3>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-900 border-r border-slate-200">
                  項目名
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-900 border-r border-slate-200">
                  説明
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-900 border-r border-slate-200">
                  数量
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-900 border-r border-slate-200">
                  単価
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                  金額
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-25"}>
                  <td className="px-4 py-3 text-sm text-slate-900 border-r border-slate-200">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 border-r border-slate-200">
                    {item.description || "－"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900 text-center border-r border-slate-200">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900 text-right border-r border-slate-200">
                    ¥{item.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900 text-right font-medium">
                    ¥{item.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Section */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <Separator className="mb-4" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">小計</span>
              <span className="text-slate-900">¥{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">消費税（10%）</span>
              <span className="text-slate-900">¥{Math.floor(totalAmount * 0.1).toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-slate-900">合計金額</span>
              <span className="text-slate-900">¥{Math.floor(totalAmount * 1.1).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 pt-8 border-t border-slate-200">
        この文書は「GAS文書アシスタント」で生成されました。
      </div>
    </div>
  );
}
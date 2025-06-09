import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TemplateForm from "@/components/template-form";
import GasCodeGenerator from "@/components/gas-code-generator";
import DocumentPreview from "@/components/document-preview";
import PdfExport from "@/components/pdf-export";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Eye, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { DocumentTemplate, CompanyInfo, CustomerInfo, DocumentItem } from "@shared/schema";

export default function DocumentGenerator() {
  const { templateId } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("form");
  const [formData, setFormData] = useState<{
    companyInfo: CompanyInfo | null;
    customerInfo: CustomerInfo | null;
    items: DocumentItem[];
  }>({
    companyInfo: null,
    customerInfo: null,
    items: [],
  });

  const { data: template, isLoading, error } = useQuery<DocumentTemplate>({
    queryKey: ['/api/templates', templateId],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${templateId}`);
      if (!response.ok) {
        throw new Error('Template not found');
      }
      return response.json();
    },
    enabled: !!templateId,
    retry: 3,
    staleTime: 0,
  });

  const generateCodeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "コード生成完了",
        description: "GASコードが正常に生成されました。",
      });
      setActiveTab("code");
    },
    onError: (error: any) => {
      toast({
        title: "エラー",
        description: `コード生成に失敗しました: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleFormSubmit = (data: any) => {
    // Ensure we have template ID from URL params even if template object is null
    const currentTemplateId = templateId ? parseInt(templateId) : null;
    
    if (!currentTemplateId) {
      console.error("No template ID found");
      toast({
        title: "エラー",
        description: "テンプレートIDが見つかりません",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(data);
    const mutationData = {
      templateId: currentTemplateId,
      ...data,
    };
    generateCodeMutation.mutate(mutationData);
  };

  const handleFormChange = (data: any) => {
    setFormData(data);
  };

  const isFormValid = formData.companyInfo && formData.customerInfo && formData.items.length > 0;

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

  if (!template && templateId) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                テンプレートが見つかりません
              </h2>
              <p className="text-slate-600 mb-4">
                指定されたテンプレートは存在しないか、削除された可能性があります。
              </p>
              <Link href="/templates">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  テンプレート一覧に戻る
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/templates">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  戻る
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {template?.name || "文書生成"}
                </h1>
                {template && (
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary">
                      {template.type === "estimate" ? "見積書" : 
                       template.type === "order" ? "注文書" : "請求書"}
                    </Badge>
                    <span className="text-sm text-slate-500">{template.description}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab("preview")} disabled={!isFormValid}>
                <Eye className="w-4 h-4 mr-2" />
                プレビュー
              </Button>
              <PdfExport 
                template={template}
                companyInfo={formData.companyInfo}
                customerInfo={formData.customerInfo}
                items={formData.items}
              />
            </div>
          </div>

          {/* Main Content */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="form">情報入力</TabsTrigger>
                    <TabsTrigger value="preview" disabled={!isFormValid}>
                      プレビュー
                    </TabsTrigger>
                    <TabsTrigger value="code" disabled={!generateCodeMutation.data}>
                      GASコード
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <TabsContent value="form" className="p-6">
                  <TemplateForm 
                    template={template}
                    onSubmit={handleFormSubmit}
                    onChange={handleFormChange}
                    isLoading={generateCodeMutation.isPending}
                  />
                </TabsContent>

                <TabsContent value="preview" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">文書プレビュー</h3>
                    <div className="bg-white p-8 rounded-lg min-h-[400px] border border-slate-200 shadow-inner">
                      {isFormValid ? (
                        <DocumentPreview 
                          template={template}
                          companyInfo={formData.companyInfo}
                          customerInfo={formData.customerInfo}
                          items={formData.items}
                        />
                      ) : (
                        <div className="text-center text-slate-500 py-16">
                          <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                          <p className="text-lg font-medium mb-2">プレビューを表示するには</p>
                          <p>情報入力タブで必要な情報を入力してください</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="p-6">
                  {generateCodeMutation.data && (
                    <GasCodeGenerator 
                      generatedCode={generateCodeMutation.data.code}
                      instructions={generateCodeMutation.data.instructions}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

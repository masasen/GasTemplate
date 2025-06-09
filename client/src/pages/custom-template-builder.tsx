import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Code, FileText, ArrowLeft, Save, Eye } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const customTemplateSchema = z.object({
  name: z.string().min(1, "テンプレート名は必須です"),
  type: z.enum(["estimate", "order", "invoice"], {
    required_error: "文書タイプを選択してください"
  }),
  description: z.string().min(1, "説明は必須です"),
  fields: z.object({
    companyInfo: z.array(z.string()).min(1, "会社情報項目は最低1つ必要です"),
    customerInfo: z.array(z.string()).min(1, "顧客情報項目は最低1つ必要です"),
    items: z.array(z.string()).min(1, "商品明細項目は最低1つ必要です")
  }),
  gasCode: z.string().min(1, "GASコードは必須です"),
});

type CustomTemplateFormData = z.infer<typeof customTemplateSchema>;

const defaultFields = {
  companyInfo: ["name", "address", "phone", "email"],
  customerInfo: ["name", "address", "phone", "email"],
  items: ["name", "description", "quantity", "unitPrice", "total"]
};

const fieldLabels: Record<string, string> = {
  name: "名前",
  address: "住所", 
  phone: "電話番号",
  email: "メールアドレス",
  website: "ウェブサイト",
  logo: "ロゴ",
  contactPerson: "担当者名",
  description: "説明",
  quantity: "数量",
  unitPrice: "単価",
  total: "合計",
  category: "カテゴリ",
  code: "商品コード"
};

export default function CustomTemplateBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<CustomTemplateFormData>({
    resolver: zodResolver(customTemplateSchema),
    defaultValues: {
      name: "",
      type: "estimate",
      description: "",
      fields: defaultFields,
      gasCode: generateDefaultGasCode("estimate"),
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: CustomTemplateFormData) => {
      const response = await apiRequest("POST", "/api/templates", {
        ...data,
        isPublic: true
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "作成完了",
        description: "カスタムテンプレートが作成されました。",
      });
      setLocation("/templates");
    },
    onError: () => {
      toast({
        title: "エラー",
        description: "テンプレートの作成に失敗しました。",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: CustomTemplateFormData) => {
    createTemplateMutation.mutate(data);
  };

  const addField = (category: keyof typeof defaultFields, fieldName: string) => {
    const currentFields = form.getValues(`fields.${category}`);
    if (!currentFields.includes(fieldName)) {
      form.setValue(`fields.${category}`, [...currentFields, fieldName]);
    }
  };

  const removeField = (category: keyof typeof defaultFields, fieldName: string) => {
    const currentFields = form.getValues(`fields.${category}`);
    form.setValue(`fields.${category}`, currentFields.filter(f => f !== fieldName));
  };

  const watchedType = form.watch("type");
  
  // 文書タイプが変更されたときにGASコードを更新
  const handleTypeChange = (type: string) => {
    form.setValue("type", type as any);
    form.setValue("gasCode", generateDefaultGasCode(type));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setLocation("/templates")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  カスタムテンプレート作成
                </h1>
                <p className="text-slate-600">
                  独自の業務に合わせたテンプレートを作成できます
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab("preview")}>
                <Eye className="w-4 h-4 mr-2" />
                プレビュー
              </Button>
              <Button 
                onClick={form.handleSubmit(handleSubmit)}
                disabled={createTemplateMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {createTemplateMutation.isPending ? "作成中..." : "テンプレート作成"}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">基本設定</TabsTrigger>
                    <TabsTrigger value="fields">項目設定</TabsTrigger>
                    <TabsTrigger value="code">GASコード</TabsTrigger>
                  </TabsList>
                </CardHeader>

                <TabsContent value="basic" className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">テンプレート名 *</Label>
                        <Input
                          id="name"
                          {...form.register("name")}
                          placeholder="例: 詳細見積書 v2"
                        />
                        {form.formState.errors.name && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="type">文書タイプ *</Label>
                        <Select value={watchedType} onValueChange={handleTypeChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="文書タイプを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="estimate">見積書</SelectItem>
                            <SelectItem value="order">注文書</SelectItem>
                            <SelectItem value="invoice">請求書</SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.type && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.type.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">説明 *</Label>
                      <Textarea
                        id="description"
                        {...form.register("description")}
                        placeholder="このテンプレートの用途や特徴を説明してください"
                        rows={3}
                      />
                      {form.formState.errors.description && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fields" className="p-6">
                  <div className="space-y-8">
                    {Object.entries(defaultFields).map(([category, availableFields]) => (
                      <Card key={category}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {category === "companyInfo" ? "会社情報項目" :
                             category === "customerInfo" ? "顧客情報項目" : "商品明細項目"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {form.watch(`fields.${category as keyof typeof defaultFields}`)?.map((field) => (
                              <Badge key={field} variant="secondary" className="flex items-center gap-2">
                                {fieldLabels[field] || field}
                                <button
                                  type="button"
                                  onClick={() => removeField(category as keyof typeof defaultFields, field)}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>

                          <Separator />

                          <div>
                            <Label className="text-sm font-medium">利用可能な項目</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.keys(fieldLabels).map((field) => {
                                const isSelected = form.watch(`fields.${category as keyof typeof defaultFields}`)?.includes(field);
                                return (
                                  <Button
                                    key={field}
                                    type="button"
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                      if (isSelected) {
                                        removeField(category as keyof typeof defaultFields, field);
                                      } else {
                                        addField(category as keyof typeof defaultFields, field);
                                      }
                                    }}
                                  >
                                    <Plus className="w-3 h-3 mr-1" />
                                    {fieldLabels[field]}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="code" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Google Apps Script コード</h3>
                        <p className="text-sm text-slate-600">
                          生成される文書の形式とロジックを定義します
                        </p>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => form.setValue("gasCode", generateDefaultGasCode(watchedType))}
                      >
                        <Code className="w-4 h-4 mr-2" />
                        デフォルトコードを再生成
                      </Button>
                    </div>

                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        コードは高度な機能です。JavaScriptとGoogle Apps Scriptの知識が必要です。
                        デフォルトコードを基に変更することをお勧めします。
                      </AlertDescription>
                    </Alert>

                    <div>
                      <Label htmlFor="gasCode">GASコード *</Label>
                      <Textarea
                        id="gasCode"
                        {...form.register("gasCode")}
                        className="font-mono text-sm min-h-[400px]"
                        placeholder="Google Apps Script のコードを入力してください"
                      />
                      {form.formState.errors.gasCode && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.gasCode.message}
                        </p>
                      )}
                    </div>
                  </div>
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

function generateDefaultGasCode(type: string): string {
  const functionName = type === "estimate" ? "createEstimate" : 
                       type === "order" ? "createOrder" : "createInvoice";
  const documentTitle = type === "estimate" ? "見積書" : 
                        type === "order" ? "注文書" : "請求書";

  return `
function ${functionName}() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = spreadsheet.getSheetByName('設定') || spreadsheet.insertSheet('設定');
  const itemsSheet = spreadsheet.getSheetByName('商品明細') || spreadsheet.insertSheet('商品明細');
  const outputSheet = spreadsheet.getSheetByName('出力') || spreadsheet.insertSheet('出力');
  
  // 会社情報の取得
  const companyInfo = {
    name: configSheet.getRange('B2').getValue() || '',
    address: configSheet.getRange('B3').getValue() || '',
    phone: configSheet.getRange('B4').getValue() || '',
    email: configSheet.getRange('B5').getValue() || ''
  };
  
  // 顧客情報の取得
  const customerInfo = {
    name: configSheet.getRange('B7').getValue() || '',
    address: configSheet.getRange('B8').getValue() || '',
    phone: configSheet.getRange('B9').getValue() || '',
    email: configSheet.getRange('B10').getValue() || ''
  };
  
  // 商品明細の取得
  const itemsData = itemsSheet.getRange('A2:E100').getValues();
  const items = itemsData.filter(row => row[0] !== '').map(row => ({
    name: row[0],
    description: row[1],
    quantity: row[2],
    unitPrice: row[3],
    total: row[4]
  }));
  
  generate${documentTitle.replace('書', '')}Document(outputSheet, companyInfo, customerInfo, items);
}

function generate${documentTitle.replace('書', '')}Document(sheet, company, customer, items) {
  sheet.clear();
  
  // ヘッダー
  sheet.getRange('A1').setValue('${documentTitle}').setFontSize(24).setFontWeight('bold');
  sheet.getRange('A3').setValue('発行日: ' + new Date().toLocaleDateString('ja-JP'));
  
  // 会社情報
  sheet.getRange('A5').setValue('発行者情報:').setFontWeight('bold');
  sheet.getRange('A6').setValue(company.name);
  sheet.getRange('A7').setValue(company.address);
  sheet.getRange('A8').setValue('TEL: ' + company.phone);
  sheet.getRange('A9').setValue('Email: ' + company.email);
  
  // 顧客情報
  sheet.getRange('E5').setValue('宛先:').setFontWeight('bold');
  sheet.getRange('E6').setValue(customer.name + ' 様');
  sheet.getRange('E7').setValue(customer.address);
  
  // 明細ヘッダー
  let currentRow = 12;
  sheet.getRange(currentRow, 1, 1, 5).setValues([['商品名', '説明', '数量', '単価', '金額']]);
  sheet.getRange(currentRow, 1, 1, 5).setFontWeight('bold').setBackground('#f0f0f0');
  
  // 明細データ
  currentRow++;
  let total = 0;
  items.forEach(item => {
    sheet.getRange(currentRow, 1, 1, 5).setValues([[
      item.name,
      item.description,
      item.quantity,
      '¥' + item.unitPrice.toLocaleString(),
      '¥' + item.total.toLocaleString()
    ]]);
    total += item.total;
    currentRow++;
  });
  
  // 合計
  currentRow += 2;
  sheet.getRange(currentRow, 4).setValue('合計:').setFontWeight('bold');
  sheet.getRange(currentRow, 5).setValue('¥' + total.toLocaleString()).setFontWeight('bold');
  
  // スタイルの調整
  sheet.autoResizeColumns(1, 5);
}
`.trim();
}
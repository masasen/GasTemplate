import { useState, useEffect } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Building, User, ShoppingCart } from "lucide-react";
import type { DocumentTemplate, CompanyInfo, CustomerInfo, DocumentItem } from "@shared/schema";

const formSchema = z.object({
  companyInfo: z.object({
    name: z.string().min(1, "会社名は必須です"),
    address: z.string().min(1, "住所は必須です"),
    phone: z.string().min(1, "電話番号は必須です"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    website: z.string().optional(),
    logo: z.string().optional(),
  }),
  customerInfo: z.object({
    name: z.string().min(1, "顧客名は必須です"),
    address: z.string().min(1, "住所は必須です"),
    phone: z.string().optional(),
    email: z.string().optional(),
    contactPerson: z.string().optional(),
  }),
  items: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "項目名は必須です"),
    description: z.string().optional(),
    quantity: z.number().min(1, "数量は1以上である必要があります"),
    unitPrice: z.number().min(0, "単価は0以上である必要があります"),
    total: z.number(),
  })).min(1, "少なくとも1つの項目が必要です"),
});

type FormData = z.infer<typeof formSchema>;

interface TemplateFormProps {
  template?: DocumentTemplate;
  onSubmit: (data: FormData) => void;
  onChange?: (data: FormData) => void;
  isLoading?: boolean;
}

export default function TemplateForm({ template, onSubmit, onChange, isLoading }: TemplateFormProps) {
  const [items, setItems] = useState<DocumentItem[]>([
    { id: "1", name: "", description: "", quantity: 1, unitPrice: 0, total: 0 }
  ]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyInfo: {
        name: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        logo: "",
      },
      customerInfo: {
        name: "",
        address: "",
        phone: "",
        email: "",
        contactPerson: "",
      },
      items: items,
    },
    mode: "onChange",
  });

  // Watch form changes and notify parent
  const watchedValues = form.watch();
  
  useEffect(() => {
    if (onChange) {
      const currentData = {
        companyInfo: watchedValues.companyInfo || {
          name: "",
          address: "",
          phone: "",
          email: "",
          website: "",
          logo: "",
        },
        customerInfo: watchedValues.customerInfo || {
          name: "",
          address: "",
          phone: "",
          email: "",
          contactPerson: "",
        },
        items: items,
      };
      onChange(currentData);
    }
  }, [watchedValues.companyInfo?.name, watchedValues.customerInfo?.name, items.length]);

  const addItem = () => {
    const newItem: DocumentItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof DocumentItem, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    });
    setItems(updatedItems);
    form.setValue("items", updatedItems);
  };

  const handleSubmit = (data: FormData) => {
    data.items = items;
    onSubmit(data);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-500" />
            会社情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-name">会社名 *</Label>
              <Input
                id="company-name"
                {...form.register("companyInfo.name")}
                placeholder="株式会社サンプル"
              />
              {form.formState.errors.companyInfo?.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.companyInfo.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="company-email">メールアドレス *</Label>
              <Input
                id="company-email"
                type="email"
                {...form.register("companyInfo.email")}
                placeholder="info@example.com"
              />
              {form.formState.errors.companyInfo?.email && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.companyInfo.email.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="company-address">住所 *</Label>
            <Textarea
              id="company-address"
              {...form.register("companyInfo.address")}
              placeholder="〒000-0000 東京都..."
              rows={2}
            />
            {form.formState.errors.companyInfo?.address && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.companyInfo.address.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-phone">電話番号 *</Label>
              <Input
                id="company-phone"
                {...form.register("companyInfo.phone")}
                placeholder="03-0000-0000"
              />
              {form.formState.errors.companyInfo?.phone && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.companyInfo.phone.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="company-website">ウェブサイト</Label>
              <Input
                id="company-website"
                {...form.register("companyInfo.website")}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-green-500" />
            顧客情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer-name">顧客名 *</Label>
              <Input
                id="customer-name"
                {...form.register("customerInfo.name")}
                placeholder="田中太郎"
              />
              {form.formState.errors.customerInfo?.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.customerInfo.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="customer-contact">担当者名</Label>
              <Input
                id="customer-contact"
                {...form.register("customerInfo.contactPerson")}
                placeholder="田中太郎"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="customer-address">住所 *</Label>
            <Textarea
              id="customer-address"
              {...form.register("customerInfo.address")}
              placeholder="〒000-0000 大阪府..."
              rows={2}
            />
            {form.formState.errors.customerInfo?.address && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.customerInfo.address.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer-phone">電話番号</Label>
              <Input
                id="customer-phone"
                {...form.register("customerInfo.phone")}
                placeholder="06-0000-0000"
              />
            </div>
            <div>
              <Label htmlFor="customer-email">メールアドレス</Label>
              <Input
                id="customer-email"
                type="email"
                {...form.register("customerInfo.email")}
                placeholder="customer@example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-500" />
              商品・サービス明細
            </CardTitle>
            <Button type="button" onClick={addItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              項目追加
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <Card key={item.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <Label>項目名 *</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder="商品・サービス名"
                  />
                </div>
                <div className="md:col-span-3">
                  <Label>説明</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="詳細説明"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>数量</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>単価</Label>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-right">
                <span className="text-sm text-slate-600">
                  小計: ¥{item.total.toLocaleString()}
                </span>
              </div>
            </Card>
          ))}
          
          <Separator />
          
          <div className="text-right space-y-2">
            <div className="text-lg font-semibold">
              合計金額: ¥{totalAmount.toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? "生成中..." : "GASコードを生成"}
        </Button>
      </div>
    </form>
  );
}

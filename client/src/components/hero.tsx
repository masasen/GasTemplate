import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, PlayCircle, CheckCircle, Shield, Clock, File, ShoppingCart, Receipt } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                <Rocket className="w-4 h-4 mr-2" />
                コーディング不要
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                見積書・請求書を<br />
                <span className="text-primary">自動生成</span>で<br />
                業務効率アップ
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Google Apps Scriptを使って、面倒な書類作成を自動化。プログラミング知識不要で、誰でも簡単に使えるノーコードツールです。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/generator">
                <Button size="lg" className="bg-primary text-white hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  <Rocket className="w-5 h-5 mr-2" />
                  今すぐ無料で始める
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:border-primary hover:text-primary transition-colors">
                <PlayCircle className="w-5 h-5 mr-2" />
                デモを見る
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-success mr-2" />
                無料プラン有り
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-success mr-2" />
                安全・セキュア
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-success mr-2" />
                5分で設定完了
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 px-4 py-3 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="ml-4 text-xs text-slate-500">gas-document-assistant.app</div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">文書作成ダッシュボード</h3>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    準備完了
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <File className="text-blue-500 w-6 h-6 mx-auto mb-2" />
                    <div className="text-xs text-slate-600">見積書</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <ShoppingCart className="text-green-500 w-6 h-6 mx-auto mb-2" />
                    <div className="text-xs text-slate-600">注文書</div>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg text-center">
                    <Receipt className="text-amber-500 w-6 h-6 mx-auto mb-2" />
                    <div className="text-xs text-slate-600">請求書</div>
                  </div>
                </div>

                <Link href="/generator">
                  <Button className="w-full bg-primary text-white hover:bg-indigo-700">
                    新しい文書を作成
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

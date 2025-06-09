import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();

  const navigation = [
    { name: "機能一覧", href: "/#features" },
    { name: "テンプレート", href: "/templates" },
    { name: "使い方", href: "/#guide" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <FileText className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">GAS文書アシスタント</h1>
              <p className="text-xs text-slate-500">簡単・自動・効率化</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-slate-600 hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            ))}
            <Link href="/generator">
              <Button className="bg-primary text-white hover:bg-indigo-700">
                無料で始める
              </Button>
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-slate-600 hover:text-primary transition-colors text-lg"
                  >
                    {item.name}
                  </a>
                ))}
                <Link href="/generator">
                  <Button className="bg-primary text-white hover:bg-indigo-700 w-full">
                    無料で始める
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import TemplateBuilder from "@/pages/template-builder";
import DocumentGenerator from "@/pages/document-generator";
import CustomTemplateBuilder from "@/pages/custom-template-builder";
import DocumentHistory from "@/pages/document-history";

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/templates" component={TemplateBuilder} />
        <Route path="/templates/create" component={CustomTemplateBuilder} />
        <Route path="/generator/:templateId?" component={DocumentGenerator} />
        <Route path="/history" component={DocumentHistory} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

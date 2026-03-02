import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PhraseProvider } from "./context/PhraseContext";
import Layout from "./components/layout/Layout";
import NotFound from "@/pages/not-found";

// Pages
import WritePage from "./pages/Write";
import DictionaryPage from "./pages/Dictionary";
import ReviewPage from "./pages/Review";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={WritePage} />
        <Route path="/dictionary" component={DictionaryPage} />
        <Route path="/review" component={ReviewPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PhraseProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </PhraseProvider>
    </QueryClientProvider>
  );
}

export default App;

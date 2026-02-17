import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Landing from "./pages/Landing";
import Categories from "./pages/Categories";
import Assistants from "./pages/Assistants";
import Questions from "./pages/Questions";
import Exams from "./pages/Exams";
import ExamAnswers from "./pages/ExamAnswers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/assistants" element={<Assistants />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exam-answers" element={<ExamAnswers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  CreateProblemPage,
  HomePage,
  RankingPage,
  ResultPage,
  SessionPage,
  SignUpPage,
} from "./pages";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/session/:sessionId" element={<SessionPage />} />
          <Route path="/result/:sessionId" element={<ResultPage />} />
          <Route path="/create-problem" element={<CreateProblemPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/ranking" element={<RankingPage />} />

          {/* 404 처리 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

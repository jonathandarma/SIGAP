import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import {
  ChatPage,
  EmergencyPage,
  GuidePage,
  HomePage,
  MapPage,
  PlanPage,
  PreviewPage,
} from "./pages/Pages";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/pantau" replace />} />
        <Route path="pantau" element={<HomePage />} />
        <Route path="peta" element={<MapPage />} />
        <Route path="rencana" element={<PlanPage />} />
        <Route path="sigap-ai" element={<ChatPage />} />
        <Route path="darurat" element={<EmergencyPage />} />
        <Route path="panduan-darurat" element={<GuidePage />} />
        <Route path="preview" element={<PreviewPage />} />
        <Route path="*" element={<Navigate to="/pantau" replace />} />
      </Route>
    </Routes>
  );
}

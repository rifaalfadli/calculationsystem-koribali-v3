// App.js
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Calculation from "./pages/Calculation";
import CalculationTypeSetup from "./pages/CalculationType";
import Report from "./pages/Report";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/shared/ScroolTop";
import Entry from "./pages/Entry";
import PoleStructurePage from "./pages/detail-input/PoleStructure";
import OpeningPage from "./pages/detail-input/Opening";
import BaseplatePage from "./pages/detail-input/Baseplate";
import FoundationPage from "./pages/detail-input/Foundation";
import NotFoundPage from "./pages/404";
import TypeGuard from "./components/pole-analyzer/TypeGuard";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/entry" element={<Entry />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="calculation">
              <Route index element={<Calculation />} />

              <Route path=":type" element={<TypeGuard />}>
                <Route index element={<CalculationTypeSetup />} />
                <Route path="pole" element={<PoleStructurePage />} />
                <Route path="opening" element={<OpeningPage />} />
                <Route path="baseplate" element={<BaseplatePage />} />
                <Route path="foundation" element={<FoundationPage />} />
              </Route>
            </Route>

            <Route path="report" element={<Report />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/entry" />} />
      </Routes>
    </>
  );
}

export default App;

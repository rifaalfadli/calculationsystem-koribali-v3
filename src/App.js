// App.js
import { Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/entry" element={<Entry />} />
        <Route path="/login" element={<Login />} />

        {/* Protected + Layout wrapper */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/calculation" element={<Calculation />} />
          <Route path="/calculation/:type" element={<CalculationTypeSetup />} />
          <Route
            path="/calculation/:type/pole"
            element={<PoleStructurePage />}
          />
          <Route path="/calculation/:type/opening" element={<OpeningPage />} />
          <Route
            path="/calculation/:type/baseplate"
            element={<BaseplatePage />}
          />
          <Route
            path="/calculation/:type/foundation"
            element={<FoundationPage />}
          />
          <Route path="/report" element={<Report />} />
        </Route>

        <Route path="/" element={<Navigate to="/entry" />} />
      </Routes>
    </>
  );
}

export default App;

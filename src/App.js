// App.js
import { Routes, Route, Navigate } from "react-router-dom";
import Calculation from "./pages/Calculation";
import { PoleStructuralAnalyzer } from "./components/PoleStructuralAnalyzer";
import Report from "./pages/Report";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/shared/ScroolTop";
import Entry from "./pages/Entry";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/entry" element={<Entry />} />
        <Route path="/login" element={<Login />} />

        {/* Rute Terproteksi: Harus login & pakai Layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/calculation" element={<Calculation />} />
                  <Route
                    path="/calculation/:type"
                    element={<PoleStructuralAnalyzer />}
                  />
                  <Route path="/report" element={<Report />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/entry" />} />
      </Routes>
    </>
  );
}

export default App;

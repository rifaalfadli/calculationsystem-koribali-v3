import { Helmet } from "react-helmet";
import {
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";
import { HeaderCalculationPage } from "../../components/pole-analyzer/PoleAnalyzerHeader";

export default function BaseplatePage() {
  const { type: projectType } = useParams();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>Calculation - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="min-h-screen bg-gray-50 border border-gray-250">
          <HeaderCalculationPage />
          <div className="mx-6 2040:mx-[300px] pt-1 pb-8 hp:mx-2">
            Baseplate
          </div>
        </div>
      </div>
    </>
  );
}

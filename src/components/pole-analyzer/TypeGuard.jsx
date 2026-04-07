import { useParams, Navigate } from "react-router-dom";
import { PROJECT_TYPES } from "../constants/projectTypes";

export default function TypeGuard({ children }) {
  const { type } = useParams();

  const allowedTypes = PROJECT_TYPES.map((item) => item.id);

  if (!allowedTypes.includes(type)) {
    return <Navigate to="/404" replace />;
  }

  return children;
}

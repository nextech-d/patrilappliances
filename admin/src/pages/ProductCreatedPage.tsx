import { useParams } from "react-router-dom";
import ProductCreatedView from "../views/ProductCreatedView";

export default function ProductCreatedPage() {
  const { id } = useParams();
  if (!id) return null;
  return <ProductCreatedView entityId={id} />;
}

import { useParams } from "react-router-dom";
import BrandCreatedView from "../views/BrandCreatedView";

export default function BrandCreatedPage() {
  const { id } = useParams();
  if (!id) return null;
  return <BrandCreatedView entityId={id} />;
}

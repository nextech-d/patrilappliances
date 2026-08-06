import { useParams } from "react-router-dom";
import SubcategoryCreatedView from "../views/SubcategoryCreatedView";

export default function SubcategoryCreatedPage() {
  const { id } = useParams();
  if (!id) return null;
  return <SubcategoryCreatedView entityId={id} />;
}

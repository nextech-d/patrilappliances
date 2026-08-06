import { useParams } from "react-router-dom";
import CategoryCreatedView from "../views/CategoryCreatedView";

export default function CategoryCreatedPage() {
  const { id } = useParams();
  if (!id) return null;
  return <CategoryCreatedView entityId={id} />;
}

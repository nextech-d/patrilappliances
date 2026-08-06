import type { Metadata } from "next";
import ContentPostDetail, {
  generateContentPostMetadata,
} from "../../components/ContentPostDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateContentPostMetadata({
    type: "article",
    params,
    listLabel: "Guides & Articles",
  });
}

export default function ArticlePage({ params }: Props) {
  return (
    <ContentPostDetail
      type="article"
      params={params}
      listLabel="Guides & Articles"
      listHref="/articles"
    />
  );
}

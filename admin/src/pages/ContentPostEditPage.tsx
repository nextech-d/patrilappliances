import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../lib/api";
import ContentPostForm, {
  type ContentPostDetail,
  type ContentPostType,
} from "../components/ContentPostForm";

const CONFIG: Record<
  ContentPostType,
  { title: string; listHref: string; newLabel: string }
> = {
  blog: {
    title: "Blog posts",
    listHref: "/content/blog",
    newLabel: "New blog post",
  },
  article: {
    title: "Articles",
    listHref: "/content/articles",
    newLabel: "New article",
  },
};

export default function ContentPostEditPage({ type }: { type: ContentPostType }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const config = CONFIG[type];
  const isNew = !id || id === "new";

  const [post, setPost] = useState<ContentPostDetail | undefined>();
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;

    async function load() {
      try {
        const data = await api<{ post: ContentPostDetail }>(`/admin/content/posts/${id}`);
        if (data.post.type !== type) {
          setError("This post belongs to a different content type.");
          return;
        }
        setPost(data.post);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isNew, type]);

  if (loading) {
    return <div className="p-8 text-sm text-neutral-500">Loading…</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => navigate(config.listHref)}
          className="mt-4 text-xs text-neutral-500 hover:text-white"
        >
          Back to list
        </button>
      </div>
    );
  }

  if (!isNew && !post) {
    return (
      <div className="p-8 text-sm text-neutral-500">
        Post not found.{" "}
        <Link to={config.listHref} className="text-[#00e599] hover:underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link
        to={config.listHref}
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {config.title}
      </Link>

      <h1 className="text-xl font-semibold text-white">
        {isNew ? config.newLabel : "Edit post"}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        {isNew ? "Create a new entry for the storefront." : post?.title}
      </p>

      <ContentPostForm
        type={type}
        post={post}
        mode={isNew ? "create" : "edit"}
        backHref={config.listHref}
      />
    </div>
  );
}

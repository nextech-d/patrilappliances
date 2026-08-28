import Link from "next/link";
import type { ContentPostType } from "@prisma/client";
import {
  contentPostPath,
  listPublishedPosts,
  type ContentPostData,
} from "../lib/content.server";
import { formatContentDate } from "../lib/markdown";

function PostCard({ post }: { post: ContentPostData }) {
  return (
    <article className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-300 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
        {post.publishedAt && <time dateTime={post.publishedAt}>{formatContentDate(post.publishedAt)}</time>}
        {post.author && (
          <>
            <span aria-hidden>·</span>
            <span>{post.author}</span>
          </>
        )}
      </div>
      <h2 className="mt-3 text-xl font-semibold text-neutral-900 group-hover:text-emerald-700">
        <Link href={contentPostPath(post.type, post.slug)} className="hover:underline">
          {post.title}
        </Link>
      </h2>
      {post.excerpt && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
      )}
      <Link
        href={contentPostPath(post.type, post.slug)}
        className="mt-4 inline-flex text-sm font-semibold text-emerald-600 hover:text-emerald-700"
      >
        Read more →
      </Link>
    </article>
  );
}

export default async function ContentPostList({
  type,
  title,
  description,
}: {
  type: ContentPostType;
  title: string;
  description: string;
}) {
  const posts = await listPublishedPosts(type);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">HomeVibe</p>
          <h1 className="mt-2 text-4xl font-light tracking-tight text-neutral-900">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">{description}</p>
        </header>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
            <p className="text-neutral-600">No published posts yet. Check back soon.</p>
            <Link href="/" className="mt-4 inline-block text-sm font-semibold text-emerald-600 hover:underline">
              Back to home
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-900">
            ← Home
          </Link>
          <span className="mx-3 text-neutral-300">|</span>
          {type === "blog" ? (
            <Link href="/articles" className="text-sm font-medium text-emerald-600 hover:underline">
              Guides & articles
            </Link>
          ) : (
            <Link href="/blog" className="text-sm font-medium text-emerald-600 hover:underline">
              Blog
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

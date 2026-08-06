function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-600 hover:underline">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code class="rounded bg-neutral-100 px-1 py-0.5 text-sm">$1</code>');
}

/** Minimal markdown → HTML for content posts (headings, lists, paragraphs, links). */
export function renderMarkdown(source: string): string {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inList = false;

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      continue;
    }

    if (trimmed.startsWith("### ")) {
      closeList();
      html.push(`<h3 class="mt-8 text-lg font-semibold text-neutral-900">${inlineMarkdown(escapeHtml(trimmed.slice(4)))}</h3>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      closeList();
      html.push(`<h2 class="mt-10 text-xl font-semibold text-neutral-900">${inlineMarkdown(escapeHtml(trimmed.slice(3)))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      closeList();
      html.push(`<h1 class="mt-10 text-2xl font-bold text-neutral-900">${inlineMarkdown(escapeHtml(trimmed.slice(2)))}</h1>`);
      continue;
    }
    if (trimmed.startsWith("- ")) {
      if (!inList) {
        html.push('<ul class="my-4 list-disc space-y-2 pl-6 text-neutral-700">');
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(escapeHtml(trimmed.slice(2)))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p class="my-4 leading-relaxed text-neutral-700">${inlineMarkdown(escapeHtml(trimmed))}</p>`);
  }

  closeList();
  return html.join("\n");
}

export function formatContentDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

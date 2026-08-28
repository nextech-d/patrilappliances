export const runtime = "nodejs";

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  return Response.json({
    ok: true,
    method: request.method,
    path: url.pathname,
    search: url.search,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;

export default handler;

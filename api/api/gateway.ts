export const runtime = "nodejs";

export function GET() {
  return Response.json({ ok: true, via: "gateway" });
}

export function POST() {
  return Response.json({ ok: true, via: "gateway" });
}

export function PUT() {
  return Response.json({ ok: true, via: "gateway" });
}

export function PATCH() {
  return Response.json({ ok: true, via: "gateway" });
}

export function DELETE() {
  return Response.json({ ok: true, via: "gateway" });
}

export function OPTIONS() {
  return new Response(null, { status: 204 });
}

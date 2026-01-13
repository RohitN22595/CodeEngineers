export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("handle");

  if (!handle) return new Response(JSON.stringify({ status: "ERROR", result: [] }), { status: 400 });

  try {
    const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
    const data = await res.json();
    return new Response(JSON.stringify(data));
  } catch (err) {
    return new Response(JSON.stringify({ status: "ERROR", result: [] }), { status: 500 });
  }
}

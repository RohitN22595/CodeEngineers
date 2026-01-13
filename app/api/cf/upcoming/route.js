export async function GET() {
  const res = await fetch("https://codeforces.com/api/contest.list", {
    cache: "no-store",
  });

  const data = await res.json();

  if (data.status !== "OK") {
    return Response.json({ error: "CF API failed" }, { status: 500 });
  }

  const upcoming = data.result
    .filter(c => c.phase === "BEFORE")
    .map(c => ({
      id: c.id,
      name: c.name,
      startTime: c.startTimeSeconds * 1000, // timestamp
      duration: c.durationSeconds,
    }));

  return Response.json(upcoming);
}

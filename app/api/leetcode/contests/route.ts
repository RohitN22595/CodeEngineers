// app/api/leetcode/contests/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://leetcode.com/contest/api/list/");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("LeetCode fetch error:", err);
    return NextResponse.json({ contests: [] });
  }
}

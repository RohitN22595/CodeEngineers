"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

type Problem = {
  contestId: number;
  index: string;
  rating?: number;
};

type Submission = {
  verdict: string;
  problem: Problem;
};

type ChartItem = {
  rating: number;
  solved: number;
};

export default function ProblemRatingsChart({ handle }: { handle: string }) {
  const [data, setData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!handle) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/cf/status?handle=${handle}`);
        const json = await res.json();
        if (json.status !== "OK") throw new Error();

        const submissions: Submission[] = json.result;
        const ratingMap: Record<number, number> = {};
        const solvedSet = new Set<string>();

        submissions.forEach((sub) => {
          if (sub.verdict !== "OK") return;

          const id = `${sub.problem.contestId}-${sub.problem.index}`;
          if (solvedSet.has(id)) return;
          solvedSet.add(id);

          const rating = sub.problem.rating ?? 0;
          ratingMap[rating] = (ratingMap[rating] || 0) + 1;
        });

        const chartData = Object.keys(ratingMap)
          .map(Number)
          .sort((a, b) => a - b)
          .map((r) => ({ rating: r, solved: ratingMap[r] }));

        setData(chartData);
      } catch {
        setError("Error fetching submissions");
      }

      setLoading(false);
    };

    fetchData();
  }, [handle]);

  if (!handle) return <p>Enter a handle to see problem ratings</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (data.length === 0) return <p>No solved problems found</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Problem Ratings for {handle}</h2>
      <BarChart width={700} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rating" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="solved" />
      </BarChart>
    </div>
  );
}

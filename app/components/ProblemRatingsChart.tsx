"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function ProblemRatingsChart({ handle }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!handle) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
        const json = await res.json();
        if (json.status !== "OK") throw new Error("Failed to fetch submissions");

        const submissions = json.result;
        const ratingMap = {};
        const solvedSet = new Set();

        submissions.forEach((sub) => {
          if (sub.verdict !== "OK") return;
          const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
          if (solvedSet.has(problemId)) return;
          solvedSet.add(problemId);

          const rating = sub.problem.rating || 0;
          ratingMap[rating] = (ratingMap[rating] || 0) + 1;
        });

        const chartData = Object.keys(ratingMap)
          .sort((a, b) => a - b)
          .map((r) => ({ rating: r, solved: ratingMap[r] }));

        setData(chartData);
      } catch (err) {
        console.error(err);
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
      <BarChart width={700} height={400} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rating" label={{ value: "Rating", position: "insideBottom", offset: -10 }} />
        <YAxis label={{ value: "Problems Solved", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="solved" fill="#8884d8" name="Problems Solved" />
      </BarChart>
    </div>
  );
}

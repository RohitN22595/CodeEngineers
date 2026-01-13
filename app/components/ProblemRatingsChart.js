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
      setData([]);

      try {
        // Fetch submissions directly from Codeforces API
        const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
        const json = await res.json();

        if (json.status !== "OK") {
          setError("Handle not found or API failed");
          setLoading(false);
          return;
        }

        const submissions = json.result;
        const ratingMap = {};
        const solvedSet = new Set();

        submissions.forEach((sub) => {
          if (sub.verdict !== "OK") return;

          const id = `${sub.problem.contestId}-${sub.problem.index}`;
          if (solvedSet.has(id)) return;
          solvedSet.add(id);

          const rating = sub.problem.rating || 0;
          ratingMap[rating] = (ratingMap[rating] || 0) + 1;
        });

        const chartData = Object.keys(ratingMap)
          .map(Number)
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
  if (loading) return <p>Loading submissions...</p>;
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
        <Bar dataKey="solved" fill="#2563eb" />
      </BarChart>
    </div>
  );
}

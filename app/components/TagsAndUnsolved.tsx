"use client";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ---------- Helpers ----------

// Stable random color generator (same tag → same color)
const getRandomColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 55%)`;
};

// ---------- API Calls ----------

// Fetch tags solved
async function fetchTagsSolved(handle) {
  const res = await fetch(
    `https://codeforces.com/api/user.status?handle=${handle}`
  );
  const data = await res.json();
  if (data.status !== "OK") return {};

  const submissions = data.result;
  const tagsMap = {};
  const solvedSet = new Set();

  submissions.forEach((sub) => {
    const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
    if (solvedSet.has(problemId)) return;

    if (sub.verdict === "OK") {
      solvedSet.add(problemId);
      sub.problem.tags.forEach((tag) => {
        tagsMap[tag] = (tagsMap[tag] || 0) + 1;
      });
    }
  });

  return tagsMap;
}

// Fetch unsolved problems
async function fetchUnsolvedProblems(handle) {
  const res = await fetch(
    `https://codeforces.com/api/user.status?handle=${handle}`
  );
  const data = await res.json();
  if (data.status !== "OK") return [];

  const submissions = data.result;
  const solvedSet = new Set();
  const unsolvedSet = new Set();

  submissions.forEach((sub) => {
    const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
    if (sub.verdict === "OK") solvedSet.add(problemId);
    else unsolvedSet.add(problemId);
  });

  return [...unsolvedSet].filter((p) => !solvedSet.has(p));
}

// ---------- Component ----------

export default function TagsAndUnsolved({ handle }) {
  const [tags, setTags] = useState({});
  const [unsolved, setUnsolved] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);

    const fetchData = async () => {
      const tagsData = await fetchTagsSolved(handle);
      const unsolvedData = await fetchUnsolvedProblems(handle);
      setTags(tagsData);
      setUnsolved(unsolvedData);
      setLoading(false);
    };

    fetchData();
  }, [handle]);

  if (!handle) return <p>Enter a handle to see tags and unsolved problems.</p>;
  if (loading) return <p>Loading tags and unsolved problems...</p>;

  // Convert tags object → pie chart data
  const pieData = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({
      name: tag,
      value: count,
    }));

  return (
    <div className="mt-6">
      {/* ---------- TAGS PIE CHART ---------- */}
      <h2 className="text-lg font-bold mb-2">Tags Solved</h2>

      <div className="border p-2 rounded">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={50}
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={getRandomColor(entry.name)}
                />
              ))}
            </Pie>

            {/* Hover details ONLY */}
            <Tooltip
              formatter={(value, name) => [`Solved: ${value}`, name]}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>

      </div>

      {/* ---------- UNSOLVED PROBLEMS ---------- */}
      <h2 className="text-lg font-bold mt-6 mb-2">Unsolved Problems</h2>

      <div className="overflow-x-auto max-h-64 border p-2 rounded">
        <p>Count : {unsolved.length}</p>

        <div className="mt-2 flex flex-wrap gap-2">
          {unsolved.map((p) => {
            const [contestId, index] = p.split("-");
            const url = `https://codeforces.com/contest/${contestId}/problem/${index}`;

            return (
              <a
                key={p}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-gray-200 rounded hover:bg-blue-200 hover:text-blue-800 transition cursor-pointer"
              >
                {p}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

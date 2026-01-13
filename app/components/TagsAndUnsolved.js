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

/* ---------- Helpers ---------- */

const getRandomColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 55%)`;
};

async function fetchStats(handle) {
  const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
  const data = await res.json();
  if (data.status !== "OK") return { tags: {}, unsolved: [] };

  const tagsMap = {};
  const solvedSet = new Set();
  const unsolvedSet = new Set();

  data.result.forEach((sub) => {
    const problemId = `${sub.problem.contestId}-${sub.problem.index}`;

    if (sub.verdict === "OK") {
      solvedSet.add(problemId);
      sub.problem.tags.forEach((tag) => {
        tagsMap[tag] = (tagsMap[tag] || 0) + 1;
      });
    } else {
      unsolvedSet.add(problemId);
    }
  });

  return {
    tags: tagsMap,
    unsolved: [...unsolvedSet].filter((p) => !solvedSet.has(p)),
  };
}

/* ---------- Component ---------- */

export default function TagsAndUnsolved({ handle }) {
  const [tags, setTags] = useState({});
  const [unsolved, setUnsolved] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);

    fetchStats(handle).then(({ tags, unsolved }) => {
      setTags(tags);
      setUnsolved(unsolved);
      setLoading(false);
    });
  }, [handle]);

  if (!handle) return <p>Enter a handle to see tags.</p>;
  if (loading) return <p>Loading tags and unsolved problems...</p>;

  const pieData = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">Tags Solved</h2>

      <div className="border p-2 rounded">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} innerRadius={50}>
              {pieData.map((e) => (
                <Cell key={e.name} fill={getRandomColor(e.name)} />
              ))}
            </Pie>
            <Tooltip formatter={(v, n) => [`Solved: ${v}`, n]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-lg font-bold mt-6 mb-2">Unsolved Problems</h2>

      <div className="border p-2 rounded max-h-64 overflow-auto">
        <p>Count: {unsolved.length}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {unsolved.map((p) => {
            const [contestId, index] = p.split("-");
            return (
              <a
                key={p}
                href={`https://codeforces.com/contest/${contestId}/problem/${index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-gray-200 rounded hover:bg-blue-200"
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

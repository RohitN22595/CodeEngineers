"use client";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#ff4d4f",
  "#52c41a",
  "#1890ff",
  "#faad14",
  "#722ed1",
  "#13c2c2",
];

type PieData = {
  name: string;
  value: number;
};

type Stats = {
  tried: number;
  solved: number;
};

type ContestStats = {
  count: number;
  best: number;
  worst: number;
  maxUp: number;
  maxDown: number;
};

export default function CFOverviewStats({ handle }: { handle: string }) {
  const [verdicts, setVerdicts] = useState<PieData[]>([]);
  const [languages, setLanguages] = useState<PieData[]>([]);
  const [levels, setLevels] = useState<PieData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [contests, setContests] = useState<ContestStats | null>(null);

  useEffect(() => {
    if (!handle) return;

    async function fetchData() {
      const res = await fetch(
        `https://codeforces.com/api/user.status?handle=${handle}`
      );
      const data: any = await res.json();
      if (data.status !== "OK") return;

      const subs: any[] = data.result;

      const verdictMap: Record<string, number> = {};
      const langMap: Record<string, number> = {};
      const levelMap: Record<string, number> = {};
      const solvedSet = new Set<string>();

      subs.forEach((s: any) => {
        verdictMap[s.verdict] = (verdictMap[s.verdict] || 0) + 1;
        langMap[s.programmingLanguage] =
          (langMap[s.programmingLanguage] || 0) + 1;

        if (s.verdict === "OK") {
          const id = `${s.problem.contestId}-${s.problem.index}`;
          solvedSet.add(id);
          const lvl = s.problem.index[0];
          levelMap[lvl] = (levelMap[lvl] || 0) + 1;
        }
      });

      setVerdicts(
        Object.entries(verdictMap).map(([name, value]) => ({ name, value }))
      );
      setLanguages(
        Object.entries(langMap).map(([name, value]) => ({ name, value }))
      );
      setLevels(
        Object.entries(levelMap)
          .sort()
          .map(([name, value]) => ({ name, value }))
      );

      setStats({
        tried: subs.length,
        solved: solvedSet.size,
      });
    }

    async function fetchContests() {
      const res = await fetch(
        `https://codeforces.com/api/user.rating?handle=${handle}`
      );
      const data: any = await res.json();
      if (data.status !== "OK") return;

      const ranks = data.result.map((c: any) => c.rank);
      setContests({
        count: data.result.length,
        best: Math.min(...ranks),
        worst: Math.max(...ranks),
        maxUp: Math.max(
          ...data.result.map((c: any) => c.newRating - c.oldRating)
        ),
        maxDown: Math.min(
          ...data.result.map((c: any) => c.newRating - c.oldRating)
        ),
      });
    }

    fetchData();
    fetchContests();
  }, [handle]);

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title={`Verdicts of ${handle}`}>
        <PieBlock data={verdicts} />
      </Card>

      <Card title={`Languages of ${handle}`}>
        <PieBlock data={languages} />
      </Card>

      <Card title={`Levels of ${handle}`}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={levels}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Some numbers about">
        {stats && (
          <table className="w-full text-sm">
            <tbody>
              <Row label="Tried" value={stats.tried} />
              <Row label="Solved" value={stats.solved} />
            </tbody>
          </table>
        )}
      </Card>

      <Card title="Contests">
        {contests && (
          <table className="w-full text-sm">
            <tbody>
              <Row label="Number of contests" value={contests.count} />
              <Row label="Best rank" value={contests.best} />
              <Row label="Worst rank" value={contests.worst} />
              <Row label="Max up" value={contests.maxUp} />
              <Row label="Max down" value={contests.maxDown} />
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

/* ---------- Helpers ---------- */

function PieBlock({ data }: { data: PieData[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={90}
          innerRadius={45}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded shadow p-4">
      <h3 className="font-semibold mb-2 text-center">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <tr className="border-t">
      <td className="py-2">{label}</td>
      <td className="py-2 text-right font-medium">{value}</td>
    </tr>
  );
}

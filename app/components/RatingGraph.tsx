"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

// Custom dot component
const CustomDot = ({ cx, cy, payload, maxRating }) => {
  if (cx === undefined || cy === undefined) return null;

  const isMax = payload.rating === maxRating;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={isMax ? 5 : 3}
      fill={isMax ? "red" : "#2563eb"}
      stroke="white"
      strokeWidth={1}
    />
  );
};

export default function RatingGraph({ handle }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!handle) return;

    const fetchRatingHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://codeforces.com/api/user.rating?handle=${handle}`
        );
        const json = await res.json();
        if (json.status !== "OK") return;

        const formatted = json.result.map((c) => ({
          date: dayjs
            .unix(c.ratingUpdateTimeSeconds)
            .format("YYYY-MM-DD"),
          rating: c.newRating,
          contest: c.contestName,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Rating fetch error:", err);
      }
      setLoading(false);
    };

    fetchRatingHistory();
  }, [handle]);

  if (loading) return <p>Loading rating graph...</p>;
  if (data.length === 0) return <p>No rating history available</p>;

  const maxRating = Math.max(...data.map((d) => d.rating));

  return (
    <div className="mt-6 border p-4 rounded shadow-lg">
      <h2 className="text-lg font-bold mb-3">Rating Progress</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            minTickGap={30}
          />

          <YAxis />

          <Tooltip
            formatter={(value) => [`Rating: ${value}`]}
            labelFormatter={(label, payload) =>
              payload?.[0]?.payload?.contest
                ? `${payload[0].payload.contest} (${label})`
                : label
            }
          />

          <Line
            type="linear"
            dataKey="rating"
            stroke="#2563eb"
            strokeWidth={2}
            dot={(props) => (
              <CustomDot {...props} maxRating={maxRating} />
            )}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

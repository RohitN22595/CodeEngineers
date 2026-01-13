"use client";
import React, { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";

export default function YearlyCalendar({ data, registeredYear, selectedYear, onYearChange }) {
  const currentYear = dayjs().year();
  const [year, setYear] = useState(selectedYear || currentYear);

  useEffect(() => {
    setYear(selectedYear || currentYear);
  }, [selectedYear, currentYear]);

  // Generate year options
  const years = useMemo(() => {
    const start = registeredYear || currentYear;
    const arr = [];
    for (let y = start; y <= currentYear; y++) arr.push(y);
    return arr;
  }, [registeredYear, currentYear]);

  // Generate all days
  const start = dayjs(`${year}-01-01`);
  const end = dayjs(`${year}-12-31`);

  const allDays = [];
  let current = start;
  while (current.isBefore(end) || current.isSame(end, "day")) {
    const dateStr = current.format("YYYY-MM-DD");
    const dayOfWeek = current.day();
    const count = data?.[dateStr] || 0;
    allDays.push({ date: dateStr, count, dayOfWeek });
    current = current.add(1, "day");
  }

  // Group into weeks
  const weeks = [];
  let week = new Array(7).fill(null);
  allDays.forEach((day) => {
    week[day.dayOfWeek] = day;
    if (day.dayOfWeek === 6) {
      weeks.push(week);
      week = new Array(7).fill(null);
    }
  });
  if (week.some(Boolean)) weeks.push(week);

  // Color by count
  const getGreenColor = (count) => {
    if (!count) return "bg-green-100";
    if (count === 1) return "bg-green-300";
    if (count === 2) return "bg-green-500";
    return "bg-green-700";
  };

  return (
    <div className="flex  justify-center items-end flex-col">
      {/* Year Selector */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="yearSelect" className="font-semibold">
          Year:
        </label>
        <select
          id="yearSelect"
          value={year}
          onChange={(e) => {
            setYear(Number(e.target.value));
            onYearChange?.(Number(e.target.value));
          }}
          className="border rounded px-3 py-1 cursor-pointer hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar */}
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((weekDays, i) => (
          <div key={i} className="flex flex-col gap-1">
            {weekDays.map((day, idx) =>
              day ? (
                <div
                  key={day.date}
                  className={`${getGreenColor(day.count)} w-[15px] h-[15px] rounded cursor-pointer`}
                  title={`${day.date} - ${day.count} solved`}
                />
              ) : (
                <div key={idx} className="w-[15px] h-[15px]" />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

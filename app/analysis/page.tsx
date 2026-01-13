"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import Nav from "../components/Nav";
import ProblemRatingsChart from "../components/ProblemRatingsChart";
import YearlyCalendar from "../components/YearlyCalendar";
import TagsAndUnsolved from "../components/TagsAndUnsolved";
import RatingGraph from "../components/RatingGraph";
import CFOverviewStats from "../components/CFOverviewStats";
import Footer from "../components/Footer";

// Fetch solved per day
async function fetchSolvedPerDay(handle: string) {
  const res = await fetch(
    `https://codeforces.com/api/user.status?handle=${handle}`
  );
  const data = await res.json();
  if (data.status !== "OK") return {};

  const solvedPerDay = {};
  const solvedSet = new Set();

  data.result.forEach((sub) => {
    if (sub.verdict !== "OK") return;
    const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
    if (solvedSet.has(problemId)) return;
    solvedSet.add(problemId);

    const dateStr = new Date(sub.creationTimeSeconds * 1000)
      .toISOString()
      .split("T")[0];

    solvedPerDay[dateStr] = (solvedPerDay[dateStr] || 0) + 1;
  });

  return solvedPerDay;
}

// Calculate stats
function calculateStats(solvedData) {
  const today = dayjs().format("YYYY-MM-DD");
  const last7 = dayjs().subtract(6, "day");
  const last30 = dayjs().subtract(29, "day");

  let total = 0,
    todayCount = 0,
    lastWeek = 0,
    lastMonth = 0;

  Object.entries(solvedData).forEach(([date, count]) => {
    total += count;
    if (date === today) todayCount += count;

    const d = dayjs(date);
    if (d.isAfter(last7.subtract(1, "day"))) lastWeek += count;
    if (d.isAfter(last30.subtract(1, "day"))) lastMonth += count;
  });

  return { total, todayCount, lastWeek, lastMonth };
}

export default function CodeforcesProfile() {
  const [handle, setHandle] = useState("");
  const [profile, setProfile] = useState(null);
  const [solvedData, setSolvedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [registeredYear, setRegisteredYear] = useState(dayjs().year());

  const stats = calculateStats(solvedData);

  const fetchProfileAndCalendar = async (inputHandle) => {
    const h = inputHandle || handle;
    if (!h.trim()) {
      setError("Enter a handle");
      return;
    }

    setError("");
    setProfile(null);
    setSolvedData({});
    setLoading(true);

    try {
      // Fetch profile
      const resProfile = await fetch(
        `https://codeforces.com/api/user.info?handles=${h}`
      );
      const dataProfile = await resProfile.json();
      if (dataProfile.status !== "OK") {
        setError("Handle not found");
        setLoading(false);
        return;
      }

      const user = dataProfile.result[0];
      setProfile(user);

      // Registration year
      const regYear = dayjs.unix(user.registrationTimeSeconds).year();
      setRegisteredYear(regYear);
      setSelectedYear(dayjs().year());

      // Fetch solved data
      const solved = await fetchSolvedPerDay(h);
      setSolvedData(solved);
    } catch (err) {
      console.error(err);
      setError("Error fetching profile or submissions");
    }

    setLoading(false);
  };

  return (
    <>
      <Nav
        onHandleSelect={(h) => {
          setHandle(h);
          fetchProfileAndCalendar(h);
        }}
      />

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Codeforces Profile</h1>

        {error && <p className="text-red-500">{error}</p>}

        {profile && (
          <div className="mt-6 border p-4 rounded shadow-lg">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <img
                src={profile.titlePhoto || profile.avatar}
                alt="profile"
                className="w-20 h-20 rounded-full border"
              />
              <div>
                <h2 className="text-xl font-bold">{profile.handle}</h2>
                <p className="text-sm text-gray-600">
                  Last seen:{" "}
                  {dayjs
                    .unix(profile.lastOnlineTimeSeconds)
                    .format("DD MMM YYYY, HH:mm")}
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              <p>Rating: {profile.rating ?? "N/A"}</p>
              <p>Max Rating: {profile.maxRating ?? "N/A"}</p>
              <p>Rank: {profile.rank ?? "N/A"}</p>
              <p>Max Rank: {profile.maxRank ?? "N/A"}</p>
              <p>Country: {profile.country ?? "N/A"}</p>
              <p>Organization: {profile.organization ?? "N/A"}</p>
            </div>

            {/* Solved Stats */}
            
          </div>
        )}
        {/* Yearly Calendar */}
        {!loading && Object.keys(solvedData).length > 0 && profile && (
          <div className="flex justify-center items-center w-[100%]">
            <YearlyCalendar
              data={solvedData}
              registeredYear={registeredYear}
              selectedYear={selectedYear}
              onYearChange={(y) => setSelectedYear(y)}
            />

            <div className="">
              <div className="  text-center">
                <p className="text-sm text-gray-500">Total Solved</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
              <div className="  text-center">
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-xl font-bold">{stats.todayCount}</p>
              </div>
              <div className="  text-center">
                <p className="text-sm text-gray-500">Last 7 Days</p>
                <p className="text-xl font-bold">{stats.lastWeek}</p>
              </div>
              <div className="  text-center">
                <p className="text-sm text-gray-500">Last 30 Days</p>
                <p className="text-xl font-bold">{stats.lastMonth}</p>
              </div>
            </div>
          </div>
        )}
        {/* Other Components */}
        {profile && <ProblemRatingsChart handle={profile.handle} />}
        {profile && <TagsAndUnsolved handle={profile.handle} />}
        {profile && <RatingGraph handle={profile.handle} />}
        {profile && <CFOverviewStats handle={profile.handle} />}
      </div>

      <Footer />
    </>
  );
}

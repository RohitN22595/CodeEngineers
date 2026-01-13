"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("https://codeforces.com/api/contest.list")
      .then((res) => res.json())
      .then((data) => {
        // Filter only upcoming contests
        const upcoming = data.result.filter(contest => contest.phase === "BEFORE");

        const cfEvents = upcoming.map((contest) => ({
          title: contest.name,
          start: new Date(contest.startTimeSeconds * 1000),
          end: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
          allDay: false,
        }));

        setEvents(cfEvents);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <Nav onHandleSelect={() => {}} defaultHandle="" />

      <div className="p-4">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventColor="#2563eb"
          eventClick={(info) => {
            // Open the specific contest page
            const contest = info.event.title;
            const cfContest = info.event.title; // optional if you want to use contest id
            window.open("https://codeforces.com/contests", "_blank");
          }}
        />
      </div>

      <Footer />
    </>
  );
}

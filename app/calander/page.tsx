"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function Calander() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/cf/upcoming")
      .then(res => res.json())
      .then(data => {
        const cfEvents = data.map((contest: any) => ({
          title: contest.name,
          start: new Date(contest.startTime),
          end: new Date(contest.startTime + contest.duration * 1000),
          allDay: false,
        }));
        setEvents(cfEvents);
      });
  }, []);

  return (
    <>
        <Nav/>
        <div>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventColor="#2563eb"
                eventClick={() => {
                    window.open("https://codeforces.com/contests", "_blank");
                }}
            />
        </div>
        <Footer/>
    </>
  );
}

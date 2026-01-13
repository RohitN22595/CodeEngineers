"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
};

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetch("/api/cf/upcoming")
      .then((res: Response) => res.json())
      .then((data: any[]) => {
        const cfEvents: CalendarEvent[] = data.map((contest: any) => ({
          title: contest.name,
          start: new Date(contest.startTime),
          end: new Date(contest.startTime + contest.duration * 1000),
          allDay: false,
        }));

        setEvents(cfEvents);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <Nav onHandleSelect={() => {}} defaultHandle="" />

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

      <Footer />
    </>
  );
}

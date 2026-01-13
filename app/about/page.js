"use client";
import React from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const AboutMe = () => {
  return (
    <>
      <Nav onHandleSelect={() => {}} defaultHandle="" />
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-4 text-center">About Me</h2>

        <p className="text-gray-700 text-lg leading-relaxed text-center">
          Hi 👋, I’m <span className="font-semibold">Rohit</span>, a student at
          <span className="font-semibold"> IIT Guwahati</span> and a passionate
          <span className="font-semibold"> Web Developer & Competitive Programmer</span>.
          I enjoy building clean UI, dashboards, and solving algorithmic problems.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 border rounded-lg shadow">
            <h3 className="font-bold text-xl">Web Dev</h3>
            <p className="text-gray-600">React, Next.js, Tailwind</p>
          </div>

          <div className="p-4 border rounded-lg shadow">
            <h3 className="font-bold text-xl">CP</h3>
            <p className="text-gray-600">Codeforces, DSA</p>
          </div>

          <div className="p-4 border rounded-lg shadow">
            <h3 className="font-bold text-xl">Backend</h3>
            <p className="text-gray-600">Python, Django</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutMe;

"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-16 h-[300px] bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">  
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Rohit. All rights reserved.
        </p>

        <div className="flex gap-4 text-sm">
          <a
            href="https://codeforces.com/profile/YOUR_HANDLE"
            target="_blank"
            className="hover:text-blue-400"
          >
            Codeforces
          </a>
          <a
            href="https://github.com/YOUR_GITHUB"
            target="_blank"
            className="hover:text-gray-300"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/YOUR_LINKEDIN"
            target="_blank"
            className="hover:text-blue-500"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

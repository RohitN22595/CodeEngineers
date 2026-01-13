"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav = ({ onHandleSelect, defaultHandle }) => {
  const pathname = usePathname();
  const showHandles = pathname === "/analysis"; // Only show handles logic on Analysis page

  const [handles, setHandles] = useState([]);
  const [open, setOpen] = useState(false);
  const [newHandle, setNewHandle] = useState("");
  const [defaultProfile, setDefaultProfile] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("handles") || "[]");
    setHandles(stored);
  }, []);

  const saveHandles = (list) => {
    localStorage.setItem("handles", JSON.stringify(list));
    setHandles(list);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!defaultHandle) return;
      try {
        const res = await fetch(
          `https://codeforces.com/api/user.info?handles=${defaultHandle}`
        );
        const data = await res.json();
        if (data.status === "OK") setDefaultProfile(data.result[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [defaultHandle]);

  const handleClick = (handle) => {
    onHandleSelect?.(handle);
    setOpen(false);
  };

  const addHandle = () => {
    const trimmed = newHandle.trim();
    if (!trimmed || trimmed === defaultHandle) return;
    if (!handles.includes(trimmed)) {
      const updated = [...handles, trimmed];
      saveHandles(updated);
      setNewHandle("");
    }
  };

  const removeHandle = (h) => saveHandles(handles.filter((x) => x !== h));

  return (
    <>
      <div className="bg-black h-[60px] w-full text-white flex justify-between items-center px-[20px]">
        <div className="flex justify-between items-center gap-[20px]">
          <Link href="/">HOME</Link>
          <Link href="/analysis">CF ANALYSIS</Link>
          <Link href="/calander">CONTEST CALENDAR</Link>
          <Link href="/yourcode">STORE YOUR CODE</Link>
          <Link href="/compiler">COMPILER</Link>
          <Link href="/about">ABOUT</Link>
        </div>
        {showHandles && (
          <button className="cursor-pointer" onClick={() => setOpen(true)}>
            HANDLES
          </button>
        )}
      </div>

      {/* Handles panel only on Analysis page */}
      {showHandles && open && (
        <>
          <div
            className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300`}
            style={{ width: "500px", zIndex: 1000 }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Saved Handles</h2>
              <button
                className="text-red-500 font-bold"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="p-4 border-b flex gap-2">
              <input
                type="text"
                placeholder="Add new friend handle"
                value={newHandle}
                onChange={(e) => setNewHandle(e.target.value)}
                className="flex-1 border px-2 py-1 rounded"
              />
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={addHandle}
              >
                Add
              </button>
            </div>

            <div className="p-4 flex flex-col gap-2 overflow-y-auto h-full">
              {defaultProfile && (
                <div
                  className="flex items-center gap-2 p-2 rounded bg-gray-200 cursor-pointer"
                  onClick={() => handleClick(defaultHandle)}
                >
                  <img
                    src={defaultProfile.titlePhoto || defaultProfile.avatar}
                    alt={defaultHandle}
                    className="w-10 h-10 rounded-full border"
                  />
                  <span>{defaultHandle} (You)</span>
                </div>
              )}
              {handles.length === 0 && (
                <p className="text-gray-500 mt-2">No friend handles saved</p>
              )}
              {handles.map((h) => (
                <div
                  key={h}
                  className="flex justify-between items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <span onClick={() => handleClick(h)}>{h}</span>
                  <button
                    className="text-red-500 font-bold"
                    onClick={() => removeHandle(h)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setOpen(false)}
          />
        </>
      )}
    </>
  );
};

export default Nav;

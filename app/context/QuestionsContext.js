"use client";
import React, { createContext, useState, useEffect } from "react";

export const QuestionsContext = createContext();

export const QuestionsProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("myQuestions");
    if (stored) setQuestions(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("myQuestions", JSON.stringify(questions));
  }, [questions]);

  const addQuestion = (q) => setQuestions([q, ...questions]);
  const updateQuestion = (id, updated) =>
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updated } : q)));
  const deleteQuestion = (id) =>
    setQuestions(questions.filter((q) => q.id !== id));

  return (
    <QuestionsContext.Provider
      value={{ questions, addQuestion, updateQuestion, deleteQuestion }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};

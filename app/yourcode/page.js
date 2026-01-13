"use client";
import React, { useState, useContext } from "react"; // <-- import useContext
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";
import { QuestionsContext } from "../context/QuestionsContext"; // <-- import your context
import Footer from "../components/Footer";

export default function StoreYourCode() {
  const router = useRouter();
  const { questions, addQuestion, updateQuestion, deleteQuestion } =
    useContext(QuestionsContext);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [editId, setEditId] = useState(null);
  const [expandedIds, setExpandedIds] = useState([]);

  const handleAddOrEdit = () => {
    if (!title.trim()) return alert("Enter a title");

    if (editId) {
      updateQuestion(editId, { title, description, code });
      setEditId(null);
    } else {
      addQuestion({ id: Date.now(), title, description, code });
    }

    setTitle("");
    setDescription("");
    setCode("");
    setShowForm(false);
  };

  const handleEdit = (q) => {
    setTitle(q.title);
    setDescription(q.description);
    setCode(q.code);
    setEditId(q.id);
    setShowForm(true);
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("Code copied!");
  };

  return (
    <>
      <Nav />
      <div className="p-4">
        {/* Form trigger */}
        {!showForm && (
          <div
            className="p-4 border rounded cursor-pointer hover:bg-gray-100 text-center font-semibold"
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setTitle("");
              setDescription("");
              setCode("");
            }}
          >
            + {editId ? "Edit Question" : "Add Question"}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="p-4 border rounded mt-2 space-y-2">
            <input
              type="text"
              placeholder="Question Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
            <textarea
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border px-2 py-1 rounded font-mono"
            />
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleAddOrEdit}
              >
                {editId ? "Update" : "Save"}
              </button>
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Display saved questions */}
        {questions.length > 0 && (
          <div className="mt-4 space-y-2">
            {questions.map((q) => {
              const isExpanded = expandedIds.includes(q.id);
              return (
                <div
                  key={q.id}
                  className="p-3 border rounded bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{q.title}</h3>
                    <div className="flex gap-2">
                      <button
                        className="text-blue-500 hover:underline text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(q);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteQuestion(q.id);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="text-green-600 hover:underline text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCode(q.code);
                        }}
                      >
                        Copy Code
                      </button>
                      {/* Compile button */}
                      <button
                        className="text-purple-600 hover:underline text-sm"
                        onClick={() => {
                          router.push(
                            `/compiler?code=${encodeURIComponent(
                              q.code
                            )}&lang=cpp`
                          );
                        }}
                      >
                        Compile
                      </button>
                    </div>
                  </div>

                  <p
                    className={`text-gray-700 mt-1 ${
                      !isExpanded ? "line-clamp-3" : ""
                    }`}
                    onClick={() => toggleExpand(q.id)}
                  >
                    {q.description || "No description"}
                  </p>

                  <pre
                    className={`bg-gray-100 p-2 rounded mt-2 overflow-x-auto font-mono ${
                      !isExpanded ? "line-clamp-3" : ""
                    }`}
                    onClick={() => toggleExpand(q.id)}
                  >
                    {q.code || "No code"}
                  </pre>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}

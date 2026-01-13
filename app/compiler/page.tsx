"use client";
import React, { useState } from "react";
import Nav from "../components/Nav";
import { useSearchParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import Footer from "../components/Footer";

const languageMap: Record<string, number> = {
  cpp: 52,
  python: 71,
  java: 62,
  javascript: 63,
};

export default function OnlineCompiler() {
  const searchParams = useSearchParams();
  const initialCode: string = searchParams.get("code") ?? "";
  const initialLang: string = searchParams.get("lang") ?? "cpp";

  const [code, setCode] = useState<string>(initialCode);
  const [language, setLanguage] = useState<string>(initialLang);
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const runCode = async (): Promise<void> => {
    if (!code.trim()) {
      alert("Write some code first!");
      return;
    }

    setLoading(true);
    setOutput("Running...");

    try {
      const res: Response = await fetch(
        "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source_code: code,
            stdin: input,
            language_id: languageMap[language],
          }),
        }
      );

      const data: any = await res.json();
      const result =
        data.stdout || data.compile_output || data.stderr || "No output";
      setOutput(result);
    } catch (err: unknown) {
      console.error(err);
      setOutput("Error running code");
    }

    setLoading(false);
  };

  return (
    <>
      <Nav onHandleSelect={() => {}} defaultHandle="" />

      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <select
            className="border px-2 py-1 rounded"
            value={language}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setLanguage(e.target.value)
            }
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>

          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={runCode}
          >
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>

        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={(value?: string) => setCode(value ?? "")}
          theme="vs-dark"
        />

        <textarea
          placeholder="Input (Optional)"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setInput(e.target.value)
          }
          className="w-full border px-2 py-1 rounded mt-2"
          rows={4}
        />

        <h3 className="mt-2 font-bold">Output:</h3>
        <pre className="bg-gray-100 p-2 rounded min-h-[100px] whitespace-pre-wrap">
          {output}
        </pre>
      </div>

      <Footer />
    </>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { cbtQuestions } from "../Data/CbtData";

const CBT = () => {
  const [selected, setSelected] = useState(
    Array(cbtQuestions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * cbtQuestions.length); // 1 min per question
  const timerRef = useRef();

  useEffect(() => {
    if (submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [submitted]);

  const handleChange = (qIdx, oIdx) => {
    if (submitted) return;
    const updated = [...selected];
    updated[qIdx] = oIdx;
    setSelected(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    clearInterval(timerRef.current);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-lg mt-10">
      {/* Left: Question Nav */}
      <div className="flex flex-col w-1/4 items-center mr-8">
        <div className="mb-6 text-center">
          <div className="text-xs text-gray-500">Time Left</div>
          <div
            className={`text-2xl font-bold ${
              timeLeft < 30 ? "text-red-600" : "text-blue-700"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg p-2 flex flex-wrap gap-2 shadow-inner">
          {cbtQuestions.map((_, idx) => (
            <button
              key={idx}
              className={`w-10 h-10 rounded-full font-bold border-2 transition-colors duration-150
        ${
          current === idx
            ? "bg-blue-600 text-white border-blue-700"
            : "bg-white text-gray-700 border-gray-300"
        }
        ${selected[idx] !== null ? "ring-2 ring-green-400" : ""}
        ${
          submitted && selected[idx] !== cbtQuestions[idx].answer
            ? "ring-2 ring-red-400"
            : ""
        }
      `}
              onClick={() => setCurrent(idx)}
              disabled={submitted}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
      {/* Right: Question */}
      <form onSubmit={handleSubmit} className="flex-1">
        <ol>
          <li className="bg-gray-50 rounded-lg p-5 shadow-sm border border-gray-200">
            <div className="font-semibold mb-4 text-lg text-gray-800">
              {cbtQuestions[current].question}
            </div>
            <ul className="space-y-3">
              {cbtQuestions[current].options.map((opt, oIdx) => {
                const isWrong =
                  submitted &&
                  selected[current] === oIdx &&
                  oIdx !== cbtQuestions[current].answer;
                const isCorrect =
                  submitted &&
                  oIdx === cbtQuestions[current].answer &&
                  selected[current] === oIdx;
                const isSelected = selected[current] === oIdx;

                return (
                  <li
                    key={oIdx}
                    className={`flex items-center transition-colors duration-150 cursor-pointer rounded-lg px-3 py-2 border 
                      ${
                        isWrong
                          ? "bg-red-100 text-red-600 font-bold border-red-300"
                          : ""
                      }
                      ${
                        isCorrect
                          ? "bg-green-100 text-green-700 font-bold border-green-300"
                          : ""
                      }
                      ${
                        !isWrong && !isCorrect && isSelected
                          ? "bg-blue-50 border-blue-400"
                          : "border-gray-200"
                      }
                      ${!submitted && "hover:bg-blue-100 hover:border-blue-400"}
                    `}
                    onClick={() => !submitted && handleChange(current, oIdx)}
                  >
                    <input
                      type="radio"
                      name={`question-${current}`}
                      id={`q${current}-o${oIdx}`}
                      checked={isSelected}
                      onChange={() => handleChange(current, oIdx)}
                      className="mr-3 accent-blue-600 w-5 h-5"
                      disabled={submitted}
                    />
                    <label
                      htmlFor={`q${current}-o${oIdx}`}
                      className="w-full cursor-pointer select-none text-gray-700"
                    >
                      {opt}
                    </label>
                  </li>
                );
              })}
            </ul>
            {/* Show correct answer if user got it wrong */}
            {submitted &&
              selected[current] !== cbtQuestions[current].answer && (
                <div className="text-green-700 text-sm mt-2 font-medium">
                  Correct answer:{" "}
                  <span className="underline">
                    {
                      cbtQuestions[current].options[
                        cbtQuestions[current].answer
                      ]
                    }
                  </span>
                </div>
              )}
          </li>
        </ol>
        <div className="flex justify-between mt-8">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
            disabled={current === 0}
          >
            Previous
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50"
            onClick={() =>
              setCurrent((prev) => Math.min(cbtQuestions.length - 1, prev + 1))
            }
            disabled={current === cbtQuestions.length - 1}
          >
            Next
          </button>
        </div>
        <button
          type="submit"
          className={`mt-8 w-full px-6 py-3 rounded-lg text-lg font-semibold shadow transition-colors duration-150 
            ${
              submitted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }
          `}
          disabled={submitted}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CBT;

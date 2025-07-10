import React, { useState } from 'react';
import { cbtQuestions } from "../Data/CbtData";

const CBT = () => {
  const [selected, setSelected] = useState(Array(cbtQuestions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (qIdx, oIdx) => {
    if (submitted) return; // Prevent changes after submit
    const updated = [...selected];
    updated[qIdx] = oIdx;
    setSelected(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <ol className="space-y-8">
          {cbtQuestions.map((q, qIdx) => (
            <li key={qIdx}>
              <div className="font-semibold mb-2">{q.question}</div>
              <ul className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  const isWrong =
                    submitted &&
                    selected[qIdx] === oIdx &&
                    oIdx !== q.answer;
                  const isCorrect =
                    submitted &&
                    oIdx === q.answer &&
                    selected[qIdx] === oIdx;

                  return (
                    <li
                      key={oIdx}
                      className={`flex items-center ${
                        isWrong
                          ? "bg-red-100 text-red-600 font-bold"
                          : isCorrect
                          ? "bg-green-100 text-green-700 font-bold"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIdx}`}
                        id={`q${qIdx}-o${oIdx}`}
                        checked={selected[qIdx] === oIdx}
                        onChange={() => handleChange(qIdx, oIdx)}
                        className="mr-2"
                        disabled={submitted}
                      />
                      <label htmlFor={`q${qIdx}-o${oIdx}`}>{opt}</label>
                    </li>
                  );
                })}
              </ul>
              {/* Show correct answer if user got it wrong */}
              {submitted && selected[qIdx] !== q.answer && (
                <div className="text-green-700 text-sm mt-1">
                  Correct answer: {q.options[q.answer]}
                </div>
              )}
            </li>
          ))}
        </ol>
        <button
          type="submit"
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={submitted}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CBT;
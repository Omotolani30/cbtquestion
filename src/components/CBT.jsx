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
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-lg mt-10">
      <form onSubmit={handleSubmit}>
        <ol className="space-y-8">
          {cbtQuestions.map((q, qIdx) => (
            <li key={qIdx} className="bg-gray-50 rounded-lg p-5 shadow-sm border border-gray-200">
              <div className="font-semibold mb-4 text-lg text-gray-800">{q.question}</div>
              <ul className="space-y-3">
                {q.options.map((opt, oIdx) => {
                  const isWrong =
                    submitted &&
                    selected[qIdx] === oIdx &&
                    oIdx !== q.answer;
                  const isCorrect =
                    submitted &&
                    oIdx === q.answer &&
                    selected[qIdx] === oIdx;
                  const isSelected = selected[qIdx] === oIdx;

                  return (
                    <li
                      key={oIdx}
                      className={`flex items-center transition-colors duration-150 cursor-pointer rounded-lg px-3 py-2 border 
                        ${isWrong ? "bg-red-100 text-red-600 font-bold border-red-300" : ""}
                        ${isCorrect ? "bg-green-100 text-green-700 font-bold border-green-300" : ""}
                        ${!isWrong && !isCorrect && isSelected ? "bg-blue-50 border-blue-400" : "border-gray-200"}
                        ${!submitted && 'hover:bg-blue-100 hover:border-blue-400'}
                      `}
                      onClick={() => !submitted && handleChange(qIdx, oIdx)}
                    >
                      <input
                        type="radio"
                        name={`question-${qIdx}`}
                        id={`q${qIdx}-o${oIdx}`}
                        checked={isSelected}
                        onChange={() => handleChange(qIdx, oIdx)}
                        className="mr-3 accent-blue-600 w-5 h-5"
                        disabled={submitted}
                      />
                      <label htmlFor={`q${qIdx}-o${oIdx}`} className="w-full cursor-pointer select-none text-gray-700">
                        {opt}
                      </label>
                    </li>
                  );
                })}
              </ul>
              {/* Show correct answer if user got it wrong */}
              {submitted && selected[qIdx] !== q.answer && (
                <div className="text-green-700 text-sm mt-2 font-medium">
                  Correct answer: <span className="underline">{q.options[q.answer]}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
        <button
          type="submit"
          className={`mt-10 w-full px-6 py-3 rounded-lg text-lg font-semibold shadow transition-colors duration-150 
            ${submitted ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}
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
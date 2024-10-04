"use client";

import { debateTopics } from "@/lib/constants/debateTopics";
import { useState } from "react";

const TopicGenerator = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [usedTopics, setUsedTopics] = useState([]);

  const handleSelectTopic = () => {
    const availableTopics = debateTopics.filter(
      (topic) => !usedTopics.includes(topic)
    );
    if (availableTopics.length === 0) {
      setSelectedTopic("All topics have been used!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableTopics.length);
    const newTopic = availableTopics[randomIndex];

    if (selectedTopic) {
      setUsedTopics((prevUsedTopics) => [...prevUsedTopics, selectedTopic]);
    }

    setSelectedTopic(newTopic);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleSelectTopic}
        className="px-6 py-4 rounded bg-primary hover:bg-primary-700 transition-all text-white text-3xl font-semibold w-fit mb-6"
      >
        Generate Topic
      </button>
      <div className="rounded-xl border-2 container w-2/3 px-6 leading-loose py-10 mb-20">
        {selectedTopic ? (
          <h1 className="w-full text-center font-semibold text-5xl text-primary">
            {selectedTopic}
          </h1>
        ) : (
          <h1 className="w-full text-center font-semibold text-3xl text-primary">
            Click "Generate" to begin your discussion!
          </h1>
        )}
      </div>
      {usedTopics.length > 0 && (
        <div className="rounded-xl border-2 border-secondary-700/50 container w-2/3 p-4 flex flex-col">
          <h1 className="w-full text-center text-2xl font-semibold text-secondary underline mb-4">
            Previously Used Topics
          </h1>
          <ul className="list-disc pl-6 space-y-2">
            {usedTopics.map((topic, index) => (
              <li key={index} className="text-secondary-700 text-lg">
                {topic}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopicGenerator;

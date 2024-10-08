import TopicGenerator from "@/components/debate/TopicGenerator";
import React from "react";

const DebateTopic = () => {
  return (
    <div className="container mx-auto p-6 flex flex-col space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-4">Debate Topic Generator</h1>
        <p className="text-lg text-gray-600">Generate thought-provoking debate topics for your next discussion</p>
      </div>      <TopicGenerator/>
    </div>
  );
};

export default DebateTopic;

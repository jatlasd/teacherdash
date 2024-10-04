import TopicGenerator from "@/components/debate/TopicGenerator";
import React from "react";

const DebateTopic = () => {
  return (
    <div className="container mx-auto p-6 flex flex-col space-y-6">
      <h1 className="text-4xl font-bold text-primary mb-8">Debate Topic Generator</h1>
      <TopicGenerator/>
    </div>
  );
};

export default DebateTopic;

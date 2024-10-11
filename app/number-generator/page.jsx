"use client";

import { useState } from "react";
import NumberGenerator from "@/components/number-generator/NumberGenerator";
import DiceGenerator from "@/components/number-generator/DiceGenerator";
import { Dices, Calculator, Divide } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FractionGenerator from "@/components/number-generator/FractionGenerator";

const NumberGeneratorPage = () => {
  const [genType, setGenType] = useState(null);
  const [isTypeSelected, setIsTypeSelected] = useState(false);

  const generatorTypes = [
    {
      id: 'number',
      title: 'Random Number',
      description:
        'Generate a random number within a specified range. Options to include decimals and negatives.',
      icon: <Calculator />,
    },
    {
      id: 'dice',
      title: 'Dice',
      description: 'Roll a pair of dice.',
      icon: <Dices />,
    },
    {
      id: 'fractions',
      title: 'Fractions',
      description: 'Generate random fractions with customizable numerator and denominator ranges.',
      icon: <Divide />,
    },
  ];

  const handleTypeClick = (type) => {
    setIsTypeSelected(true);
    setGenType(type.id);
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-4">
          Number Generator
        </h1>
        <p className="text-lg text-gray-600">
          Select a generator type to get started
        </p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out ${isTypeSelected ? 'max-w-3xl mx-auto' : ''}`}>
        {generatorTypes.map((type) => (
          <div key={type.id} className={`transition-all duration-500 ease-in-out ${isTypeSelected ? 'w-full' : ''}`}>
            <Button
              className={`w-full h-full flex flex-col items-center justify-center space-y-4 p-6 border-none shadow-none rounded 
                transition-all duration-500 ease-in-out
                hover:transition-colors hover:duration-200
                ${isTypeSelected 
                  ? 'h-24 space-y-2 p-2' 
                  : 'hover:shadow-lg'
                }
                ${genType === type.id
                  ? "bg-primary-300 text-white hover:bg-primary-300"
                  : "bg-white text-primary hover:bg-primary-200 border-2 border-primary-200/50"
                }`}
              onClick={() => handleTypeClick(type)}
            >
              {type.icon}
              <p className={`text-sm transition-all duration-500 ease-in-out ${isTypeSelected ? 'text-xs' : 'text-xl font-semibold'}`}>
                {type.title}
              </p>
              {!isTypeSelected && (
                <p className={`text-sm text-gray-600 text-center text-wrap transition-opacity duration-500 ease-in-out ${isTypeSelected ? 'opacity-0' : 'opacity-100'}`}>
                  {type.description}
                </p>
              )}
            </Button>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center">
        {genType === "number" && <NumberGenerator />}
        {genType === "dice" && <DiceGenerator />}
        {genType === "fractions" && <FractionGenerator />}
      </div>
    </div>
  );
};

export default NumberGeneratorPage;

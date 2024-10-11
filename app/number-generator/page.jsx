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
  ]

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {generatorTypes.map((type) => (
          <Card key={type.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Button
                className={`w-full h-full flex flex-col items-center justify-center space-y-4 p-6 border-none shadow-none rounded ${
                  genType === type.id
                    ? "bg-primary-300 text-white hover:bg-primary-300"
                    : "bg-white text-primary hover:bg-primary-200"
                }`}
                onClick={() => setGenType(type.id)}
              >
                {type.icon}
                <h3 className="text-xl font-semibold">{type.title}</h3>
                <p
                  className={`text-sm text-gray-600 text-center text-wrap ${
                    genType === type.id ? "text-white" : "text-gray-600"
                  }`}
                >
                  {type.description}
                </p>
              </Button>
            </CardContent>
          </Card>
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

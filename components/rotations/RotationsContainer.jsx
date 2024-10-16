"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import RotationsDisplay from "./RotationsDisplay";

const RotationsContainer = () => {
  const [centers, setCenters] = useState([]);
  const [newCenter, setNewCenter] = useState("");
  const [isFinalized, setIsFinalized] = useState(false);

  const handleAddCenter = () => {
    if (newCenter.trim()) {
      setCenters([...centers, { id: Date.now(), name: newCenter.trim() }]);
      setNewCenter("");
    }
  };

  const handleRemoveCenter = (id) => {
    setCenters(centers.filter((center) => center.id !== id));
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {!isFinalized ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              Rotation Centers
            </CardTitle>
            <CardDescription>
              Create the list of centers for your rotations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                value={newCenter}
                onChange={(e) => setNewCenter(e.target.value)}
                placeholder="Enter center name"
                onKeyPress={(e) => e.key === "Enter" && handleAddCenter()}
              />
              <Button
                onClick={handleAddCenter}
                className="bg-primary hover:bg-primary-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Center
              </Button>
            </div>
            {centers.length > 0 && (
              <>
                <Button
                  className="bg-secondary hover:bg-secondary-700 mb-5"
                  onClick={() => setCenters([])}
                >
                  Clear All
                </Button>
                <div className="columns-4">
                  {centers.map((center, index) => (
                    <div
                      key={center.id}
                      className="flex items-center bg-gray-100 rounded p-6"
                    >
                      <span
                        className={`flex-grow text-center text-4xl font-semibold ${
                          index % 2 === 0 ? "text-primary" : "text-secondary"
                        }`}
                      >
                        {center.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCenter(center.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="w-full flex justify-center">
                  <Button
                    className="bg-primary hover:bg-primary-700 text-xl my-5"
                    size="lg"
                    onClick={() => setIsFinalized(true)}
                  >
                    Finalize Centers
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col space-y-8">
          <div className="w-full flex justify-center">
            <Button
              className="bg-secondary hover:bg-secondary-600 mb-5 w-1/12"
              onClick={() => setIsFinalized(false)}
            >
              Reset Centers
            </Button>
          </div>
          <RotationsDisplay centers={centers} />
        </div>
      )}
    </div>
  );
};

export default RotationsContainer;

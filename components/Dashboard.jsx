"use client";

import { useRouter } from "next/navigation";
import { Users, Brain, UserCheck, Calculator, Clock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import TodoList from "./todos/TodoList";

const appCards = [
  {
    id: "group-maker",
    title: "Group Maker",
    icon: <Users className="h-8 w-8" />,
    description: "Create and manage student groups",
    route: "/groups",
  },
  {
    id: "select-student",
    title: "Random Student(s) Selector",
    icon: <UserCheck className="h-8 w-8" />,
    description: "Select a student or students at random",
    route: "/select-students",
  },
  {
    id: "debate-topic",
    title: "Debate Topic Generator",
    icon: <Brain className="h-8 w-8" />,
    description: "Generate a random topic for debate",
    route: "/debate-topic",
  },
  {
    id: "number-generator",
    title: "Number Generator",
    icon: <Calculator className="h-8 w-8" />,
    description: "An assortment of random number generators",
    route: "/number-generator",
  },
  {
    id: "timer",
    title: "Timer",
    icon: <Clock className="h-8 w-8" />,
    description: "A simple timer",
    route: "/timer",
  },
];

function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto p-4">
        <div className="flex">
          <div className="mt-8 w-1/5 mr-4">
            <TodoList />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {appCards.map((app) => (
              <Card
                key={app.id}
                className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => router.push(app.route)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 text-secondary">{app.icon}</div>
                    <h2 className="text-xl font-semibold text-[#4836A1]">
                      {app.title}
                    </h2>
                  </div>
                  <p className="text-gray-600">{app.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

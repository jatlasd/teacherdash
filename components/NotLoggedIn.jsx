"use client";

import { SignInButton } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  "/images/absolutelynot.png",
  "/images/mistake.png",
  "/images/nopanic.png",
  "/images/nope.png",
  "/images/oops.png",
  "/images/stop.png",
  "/images/uhoh.png",
];

const NotLoggedIn = () => {
  const [randomImage, setRandomImage] = useState("");

  useEffect(() => {
    setRandomImage(images[Math.floor(Math.random() * images.length)]);
  }, []);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="bg-light rounded-xl shadow-lg overflow-hidden max-w-4xl w-full flex p-10">
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Welcome to Teacher Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            ...but you need to sign in to see this stuff{" "}
          </p>
          <SignInButton mode="modal">
            <button className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-colors duration-300">
              Sign In
            </button>
          </SignInButton>
        </div>
        <div className="w-1/2 relative">
          {randomImage && (
            <Image
              src={randomImage}
              alt="Teacher Dashboard"
              layout="fill"
              objectFit="contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotLoggedIn;

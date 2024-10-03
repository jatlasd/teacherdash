"use client";

import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const router = useRouter();
  return (
    <header className="bg-primary p-4 shadow-md">
      <div className="mx-10 flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-light cursor-pointer"
          onClick={() => router.push("/")}
        >
          Teacher Dashboard
        </h1>
        <div className="flex gap-x-5">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Settings className="h-6 w-6 text-light" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => router.push("/my-classes")}>
                My Classes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/logout")}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default Header;

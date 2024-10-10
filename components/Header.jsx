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
import Link from "next/link";

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
          <SignedIn>
            <Link href="/my-classes" className="text-white transition-colors p-2 hover:bg-white/10 rounded">My Classes</Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default Header;

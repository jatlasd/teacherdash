import Dashboard from '@/components/Dashboard'
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

function Home() {
  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <div className="text-center p-8">
          <p className="mb-4">Sign in to use the dashboard</p>
          <SignInButton mode="modal">
            <button className="bg-primary text-white px-4 py-2 rounded">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  )
}

export default Home
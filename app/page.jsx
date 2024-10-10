import Dashboard from '@/components/Dashboard'
import NotLoggedIn from '@/components/NotLoggedIn'
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

function Home() {
  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
    <NotLoggedIn/>
      </SignedOut>
    </>
  )
}

export default Home
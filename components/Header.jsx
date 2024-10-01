import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

function Header() {
  return (
    <header className="bg-primary p-4 shadow-md">
      <div className="mx-10 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-light">Teacher Dashboard</h1>
        <Button variant="ghost" size="icon">
          <Settings className="h-6 w-6 text-light" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  )
}

export default Header

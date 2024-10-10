import Timer from './Timer'

export default function TimerPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-primary mb-4">Timer</h1>
        <p className="text-lg text-gray-600">A simple timer for your classroom activities</p>
      </div>
      <Timer />
    </div>
  )
}

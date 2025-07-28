export default function WelcomeScreen({ onSignIn, onSignUp }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <img
        src="/logo.png"
        alt="BudgetNest Logo"
        className="h-52 w-52 mb-6 drop-shadow-xl"
        style={{ maxWidth: '92vw' }}
        loading="lazy"
      />
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">BudgetNest</h1>
      <p className="text-xl text-gray-800 font-medium mb-10">
        Simple, smart budgeting for everyday use.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
        <button
          onClick={onSignIn}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition-shadow shadow"
        >
          Already a Member? Sign In
        </button>
        <button
          onClick={onSignUp}
          className="w-full bg-green-500 text-white py-3 rounded-lg text-base font-semibold hover:bg-green-700 transition-shadow shadow"
        >
          New Here? Sign Up
        </button>
      </div>
    </div>
  )
}

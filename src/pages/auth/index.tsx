
export default function AuthPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
          Authentication Coming Soon
        </h1>
        <p className="text-gray-600 mb-4">
          The authentication system is currently under development. 
          Please check back later for full functionality.
        </p>
        <div className="mt-6">
          <a 
            href="/"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded text-center"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}

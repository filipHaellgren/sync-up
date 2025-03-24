"use client";

export default function Home() {
  const handleSteamLogin = () => {
    window.location.href = "/api/steam-auth"; // 🚀 Redirects immediately
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-bold">Steam Authentication</h1>
      <button
        onClick={handleSteamLogin}
        className="px-4 py-2 mt-4 bg-blue-500 text-white rounded"
      >
        Sign in with Steam
      </button>
    </div>
  );
}
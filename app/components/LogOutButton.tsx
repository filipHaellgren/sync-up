"use client";

export default function LogoutButton() {
  return (
    <button
      onClick={() => (window.location.href = "/api/logout")}
      className="mt-8 bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
    >
      Logout
    </button>
  );
}
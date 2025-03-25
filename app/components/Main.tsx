import React from 'react'

export default function Main() {
  return (
    <main className="flex-1 p-6 overflow-y-auto">
        <div>

            
        </div>



    {/* Logout button */}
    <button
      onClick={() => (window.location.href = "/api/logout")}
      className="mt-8 bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
    >
      Logout
    </button>
  </main>
  )
}

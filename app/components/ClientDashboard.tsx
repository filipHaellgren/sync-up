// In your ClientDashboard.tsx
import CallListener from "./CallListener";

// Then in your return statement
return (
  <CallProvider>
    <div className="flex h-screen bg-[#2B2D31] text-white">
      {/* Add the call listener */}
      <CallListener userId={profile.id} />
      
      {/* Sidebar */}
      <Sidebar
        profile={profile}
        friends={friends}
        onSelectFriend={setSelectedFriend}
      />

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        <CallPopup />
        {selectedFriend ? (
          <ChatProvider>
            <Chat user={profile} friend={selectedFriend} />
          </ChatProvider>
        ) : (
          <div>
            <h1 className="text-xl font-bold mb-4">
              SELECT A HECKING FRIEND LOOSER!!
            </h1>

            <h2 className="text-lg font-semibold mb-2">Recently Played</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 ">
              {recentGames.map((game: any) => (
                <GameCard key={game.appid} game={game} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  </CallProvider>
);

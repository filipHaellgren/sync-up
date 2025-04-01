
export default function GameCard({ game }: { game: any }) {
    const hours = Math.round(game.playtime_forever / 60);
    const recent = game.playtime_2weeks
      ? Math.round(game.playtime_2weeks / 60)
      : null;
  
    return (
      <div className="bg-[#1E1F22] rounded-lg p-2 hover:bg-[#2c2e33] transition">
        <img
          src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/capsule_184x69.jpg`}
          alt={game.name}
          className="w-full rounded"
        />
        <p className="text-xs mt-2 text-center font-medium">{game.name}</p>
  
        <div className="text-[10px] text-center text-gray-400 mt-1">
          {recent !== null ? (
            <span>{recent} h played</span>
          ) : (
            <span>{hours} hrs total</span>
          )}
        </div>
      </div>
    );
  }
"use client";

import { useEffect, useState } from "react";
import Aside from "../components/Aside";
import Main from "../components/Main";



export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  
  useEffect(() => {
    fetch("/api/steam-session")
    .then((res) => res.json())
    .then((data) => {
      if (!data.steamid) {
        setError("No Steam ID found. Please log in.");
        return;
      }
      fetch(`/api/steam-user?steamid=${data.steamid}`)
      .then((res) => res.json())
      .then((user) => {
        if (user.error) {
          setError(user.error);
        } else {
          setUserData(user);
          
        }
      })
      .catch((err) => {
        console.error("Error fetching Steam user:", err);
        setError("Could not load Steam data.");
      });
    })
    .catch((err) => {
      console.error("Error fetching session:", err);
      setError("Could not verify session.");
    });
  }, []);
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  if (!userData) {
    return <div className="p-6 text-white">Loading...</div>;
  }
 
  return (
    <div className=" md:flex h-screen bg-[#2B2D31] text-white">     
  <Aside userData={userData} />
  <div className="hidden sm:block">
  <Main />
</div>
    </div>
  );
}
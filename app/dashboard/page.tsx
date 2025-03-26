"use client"

// import { cookies } from "next/headers";
import Aside from "../components/Aside";
import Main from "../components/Main";



export default function Dashboard() {
  // const cookieStore = await cookies(); 
  // const steamid = cookieStore.get("steamid")?.value;
  // const apiKey = process.env.STEAM_API_KEY;



 
 

  return (
    <div className=" md:flex h-screen bg-[#2B2D31] text-white">     
  <Aside/>
  <div className="hidden sm:block">
  <Main />
</div>
    </div>
  );
}
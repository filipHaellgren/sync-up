
import Aside from "../components/Aside";
import Main from "../components/Main";

export default function Dashboard() {
  return (
    <div className="md:flex h-screen bg-[#2B2D31] text-white">
      <Aside />
      <div className="hidden sm:block">
        <Main />
      </div>
    </div>
  );
}
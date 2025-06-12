import { useState, useEffect } from "react";
import SidebarItem from "./SidebarItem";

const Logo = "/logoo1.png";
const ToggleIcon = "/left-circlle.jpg";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const storedSidebarState = localStorage.getItem("sidebarOpen");
    if (storedSidebarState !== null) {
      setOpen(storedSidebarState === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", open);
  }, [open]);

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-52" : "w-20"
        } transition-all duration-300 ease-in-out h-screen bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 relative z-50`} 
      >
        <img
          src={ToggleIcon}
          alt="Toggle Sidebar"
          className={`absolute cursor-pointer -right-5 rounded-full top-7 w-6 sm:w-8 h-6 sm:h-7 border-2 border-white bg-white ${
            !open ? "rotate-180" : ""
          } transition-transform duration-300`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex items-center gap-2">
          <img
            src={Logo}
            alt="LabDash Logo"
            className={`ml-8 mt-3 transition-all duration-300 ${
              open ? "w-12" : "w-8 -translate-x-2 translate-y-3"
            }`}
          />
          <h1
            className={`origin-left font-medium text-2xl pt-2 text-white transition-all duration-300 ${
              !open ? "opacity-0 scale-0" : "opacity-100 scale-100"
            }`}
          >
            LabDash
          </h1>
        </div>
        <div
          className={`pt-3 border-b-2 border-white/20 transition-all duration-300 ${
            open ? "translate-y-0" : "translate-y-5"
          }`}
        ></div>
        <SidebarItem open={open} />
      </div>
    </div>
  );
};

export default Sidebar;

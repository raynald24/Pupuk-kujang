import { useState } from "react";
import SidebarItem from "./SidebarItem";


const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      <div
        className={`
          ${open ? "w-52" : "w-20"} 
          transition-width duration-500 ease-in-out h-screen bg-[#ffff] relative
        `}
      >
        {/* Toggle Button */}
        <img
          src="left-circlle.jpg"
          className={`
            absolute cursor-pointer -right-5 rounded-full top-7 w-6 sm:w-9 h-6 sm:h-6 border-2 border-[#5fa7c9]
            ${!open && "rotate-180"} duration-500
          `}
          onClick={() => setOpen(!open)}
        />

        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <img
            src="logoo1.png"
            className={`
              cursor-pointer duration-500 ml-8 mt-3 
              ${!open ? "w-[30px] -translate-x-2 translate-y-3" : "w-13"}
            `}
          />
          <h1
            className={`
              ${!open && "scale-0"} origin-left font-medium text-2xl pt-2 
              duration-350
            `}
          >
            LabDash
          </h1>
        </div>

        {/* Divider */}
        <div
          className={`
            pt-3 border-b-2 border-[#5fa7c9] 
            transition-all duration-500 ${open ? "translate-y-0" : "translate-y-5"}
          `}
        ></div>

        {/* Sidebar Items */}
        <SidebarItem open={open} />
      </div>
    </div>
  );
};

export default Sidebar;
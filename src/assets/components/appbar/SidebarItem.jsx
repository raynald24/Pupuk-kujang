import { LayoutDashboard, UsersRound, FlaskConical, ClipboardMinus, LogOut, UserCog } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Logout, reset } from "../../features/Authslice.js";

function SidebarItem({ open }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = async () => {
    try {
      // Proses logout dan reset state
      await dispatch(Logout()); 
      await dispatch(reset()); // Reset state setelah logout

      // Setelah proses selesai, navigasikan ke halaman '/'
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  // Menyusun menu berdasarkan role user
  const Menus = [
    { title: 'Dashboard', src: <LayoutDashboard className={`${open ? 'w-5 h-5' : 'w-6 h-6'}`} />, path: '/Dashboard' },
    
    // Menambahkan menu 'Users' hanya jika user adalah admin
    ...(user && user.role === "admin" ? [
      { title: 'Users', src: <UsersRound className={`${open ? 'w-5 h-5' : 'w-6 h-6'}`} />, path: '/users' }
    ] : []),

    { title: 'Sample', src: <FlaskConical className={`${open ? 'w-5 h-5' : 'w-6 h-6'}`} />, path: '/sample' },
    { title: 'Report', src: <ClipboardMinus className={`${open ? 'w-5 h-5' : 'w-6 h-6'}`} /> },
    
    { 
      title: 'Logout', 
      src: <LogOut onClick={logout} className={`${open ? 'w-5 h-5' : 'w-6 h-6'}`} /> 
    }
  ];

  return (
    <ul className="pt-8">
      {Menus.map((menu, index) => (
        <NavLink
          to={menu.path}
          className={`
            m-3 w-40 flex items-center pl-5 gap-x-3 cursor-pointer duration-300
            ${!open ? 'border-transparent' : 'border-[#5fa7c9]'} 
            ${open ? 'hover:bg-[#7ebedb]' : 'hover:bg-transparent'} 
            p-3 pl-4 rounded-full hover:bg-[#5fa7c9]
          `}
          key={index}
        >
          <div className={`${!open ? 'translate-x-[-25%]' : 'translate-x-0'} transition-all duration-300`}>
            {menu.src}
          </div>
          <span
            className={`
              Sidebar transition-transform text-zinc-900 text-sm duration-300 
              ${open ? 'scale-100' : 'scale-0'} origin-left
            `}
          >
            {menu.title}
          </span>
        </NavLink>
      ))}

      {/* Profile Setting Section */}
      <div className="mt-60">
        <div
          className={`
            border-b-2 border-[#5fa7c9] mb-3 transition-all duration-500 
            ${open ? 'translate-y-0' : '-translate-y-1'}
          `}></div>

        <div
          className={`
            Sidebar cursor-pointer p-2 ml-1 mr-1 flex items-center 
            ${!open ? 'border-transparent' : 'border-[#5fa7c9]'} 
            ${open ? 'hover:bg-[#7ebedb]' : 'hover:bg-transparent'} 
            hover:bg-[#5fa7c9] rounded-2xl transition-all duration-300
          `}>
          <UserCog className="w-6 h-6 ml-3 mt-1 flex-shrink-0" />
          <h1
            className={`
              text-sm ml-2 transition-all duration-300 
              ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
          >
            Profile Setting
          </h1>
        </div>
      </div>
    </ul>
  );
}

export default SidebarItem;

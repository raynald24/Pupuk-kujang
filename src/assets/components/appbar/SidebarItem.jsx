import { LayoutDashboard, UsersRound, FlaskConical, ClipboardMinus, LogOut, UserCog,Microscope } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Logout, reset } from "../../features/Authslice.js";

const SidebarItem = ({ open }) => {
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

    { title: 'Analysis', src: <Microscope className={`${open ? 'w-5 h-5' : 'w-6 h-6'}`} />, path: '/analysis' },
    
    // Menu tanpa path yang tidak perlu diberikan warna saat di hover
    { title: 'Report', src: <ClipboardMinus className={`${open ? 'w-5 h-5' : 'w-6 h-6'}`} />, path: '#' },
    
    { 
      title: 'Logout', 
      src: <LogOut onClick={logout} className={`${open ? 'w-5 h-5' : 'w-6 h-6'}`} /> 
    }
  ];

  return (
    <ul className="pt-8">
      {Menus.map((menu, index) => (
        <NavLink
          to={menu.path !== '#' ? menu.path : null}  // Hindari href pada menu tanpa path
          key={index}
          className={({ isActive }) => 
            `m-3 w-40 flex items-center pl-5 gap-x-3 cursor-pointer duration-300 
            ${menu.title === 'Logout' 
              ? 'text-white hover:bg-red-500' // Hover merah untuk Logout
              : isActive && menu.path !== '#' 
              ? 'bg-white text-blue-600' // Hanya berlaku untuk menu dengan path
              : 'text-white hover:bg-white/10'} 
            ${open ? 'px-4' : 'px-2'} py-3 mx-3 rounded-md transition-colors duration-200 
            ${!open && 'opacity-0'}`
          }
        >
          <div className={`${!open ? 'translate-x-[-25%]' : 'translate-x-0'} transition-all duration-300`}>
            {menu.src}
          </div>
          <span
            className={
              `text-zinc-900 text-sm duration-300 
              ${open ? 'scale-100' : 'scale-0'} origin-left`
            }
          >
            {menu.title}
          </span>
        </NavLink>
      ))}

    </ul>
  );
};

export default SidebarItem;

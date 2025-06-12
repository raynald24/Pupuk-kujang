import React,{useState, useEffect} from "react";
import {useDispatch,useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import {LoginUser, reset} from "../features/Authslice"

const LoginPage = () => {
  const [email,setEmail] = useState ("");
  const [password,setPassword] = useState ("");
  const dispatch = useDispatch ();
  const navigate = useNavigate();
  const {user,isError,isSucces,isLoading, message} = useSelector((state)=>state.auth);

  useEffect(()=>{
    if(user || isSucces){
      console.log('Navigating to Dashboard...');
      navigate("/Dashboard")
    }
    dispatch(reset());
  },[user, isSucces, dispatch, navigate]);
  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({email,password}));
  } 

  return (
    <div className='bodyLogin w-full h-screen flex items-center justify-center '>
        <div className='w-[30%] h-[60%] px-8 pt-2 bg-emerald-100/35 bg-opacity- flex-col flex items-center gap-3 rounded-md
        shadow-slate-600 shadow-lg backdrop-blur-sm '>
        <div className="logo ms-7  grid grid-cols-9 gap-2 w-full">
            <img src="logo4.webp" alt="Logo 4" className="col-span-2 w-20 h-15 object-contain " />
            <div className="col-span-2"></div> 
            <img src="logo2.png" alt="Logo 2" className="col-span-2 w-20 h-15 object-contain" />
            <img src="logo3.png" alt="Logo 3" className="col-span-2 w-22 h-15 object-contain" />
        </div>
        <form onSubmit={Auth} className='w-full max-w-sm mx-auto' >
            {isError && <p className="text-center">{message}</p>}
            <h1 className='H1 text-black mt-2 md:text-base-sm lg:text-2xl ' >Selamat Datang di <a className='text-[#00488B]'>Labsis</a> </h1>
            <p className='text-gray-800 -mt-1 pb-2 md:text-base-xs lg:text-sm'>Laboratory Sample Information System</p>
            <hr className='border-black pb-3' />
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                   Email
                  <span className="text-red-500">*</span>
             </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email} onChange={(e)=>setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-1 border-black shadow-sm 
                          focus:outline-none focus:ring-0 focus:border-blue-800 sm:text-sm p-3 text-black"
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                Password
                <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password} onChange={(e)=>setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-1 border-black shadow-sm 
                           focus:outline-none focus:ring-0 focus:border-blue-800 sm:text-sm p-3 text-black"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#015db2] text-white 
                        rounded-md hover:bg-blue-900 focus:outline-none 
                        focus:ring-0 focus:ring-blue-500 "
            >
              {isLoading ? 'Loading..' : 'Sign In'}
            </button>
        </form>

    </div>
  </div>
    
  )
}

export default LoginPage


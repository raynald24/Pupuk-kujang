import React,{useEffect} from 'react'
import Layout from '../layouts/Layout'
import Welcome from '../components/welcome'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/Authslice';
const DashboardPage = () => {
  const dispatch= useDispatch();
  const navigate= useNavigate();
  const {isError} = useSelector((state=>state.auth));

  useEffect(()=>{
    dispatch(getMe());
  },[dispatch]);

  useEffect(()=>{
    if(isError){
      navigate("/");
    }
  },[isError, navigate]);
  return (
    <div>
      <Layout>
        <Welcome>
          <div className="w-[100%] h-[95%] bg-white border-1 border-[#5fa7c9] rounded-2xl">        
          </div>
        </Welcome>
      </Layout>
    </div>
  );
};

export default DashboardPage;
import React,{useEffect} from 'react'
import Layout from '../layouts/Layout'
import UserList from '../components/user/UserList' 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/Authslice'; 

function Users() {
  const dispatch= useDispatch();
  const navigate= useNavigate();
  const {isError, user} = useSelector((state=>state.auth));

  useEffect(()=>{
    dispatch(getMe());
  },[dispatch]);

  useEffect(()=>{
    if(isError){
      navigate("/");
    }
    if(user && user.role !== "admin"){
      navigate("/dashboard");
    }
  },[isError,user, navigate]);
  return (
    <div>
    <Layout>
    <UserList/>
    </Layout>
  </div>
  )
}

export default Users
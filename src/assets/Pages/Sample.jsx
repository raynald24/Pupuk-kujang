import React,{useEffect} from 'react'
import Layout from '../layouts/Layout'
import SampleList from '../components/sample/SampleList'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/Authslice';

function Sample() {
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
     <SampleList/>   
    </Layout>
    </div>
  )
}

export default Sample
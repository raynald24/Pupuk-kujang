import React,{useEffect} from 'react'
import Layout from '../layouts/Layout'
import AnalysisList from '../components/analysis/AnalysisList'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/Authslice';

function AnalysisPage() {
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
     <AnalysisList/>   
    </Layout>
    </div>
  )
}

export default AnalysisPage
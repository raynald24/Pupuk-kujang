import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/Authslice';
import Layout from '../layouts/Layout';
import Analysis from '../components/analysis/Analysis';

function AnalysisResult() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/');
    }
  }, [isError, navigate]);

  return (
    <Layout>
      <Analysis />
    </Layout>
  );
}

export default AnalysisResult;
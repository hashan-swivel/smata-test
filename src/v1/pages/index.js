import React, { useEffect } from 'react';
import Router from 'next/router';
import { useDispatch } from 'react-redux';
import Cookie from 'js-cookie';
import { Layout } from '@/components/v1';
import { logoutUser } from '@/actions/auth';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    Cookie.get('access_token') ? Router.push('/documents') : dispatch(logoutUser());
  }, []);

  return null;
};

Home.getLayout = (page) => <Layout>{page}</Layout>;

export default Home;

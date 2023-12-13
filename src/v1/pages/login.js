import React from 'react';
import { Layout } from '@/components/v1';
import { LoginForm } from '@/components/v1/Login';
import './register.module.scss';

const Login = () => (
  <Layout containerClassName='auth-form' compareConnectAlert={false}>
    <LoginForm />
  </Layout>
);

Login.getInitialProps = async () => {};

export default Login;

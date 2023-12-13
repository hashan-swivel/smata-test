import React from 'react';
import { Layout } from '@/components/v1';
import { CommitteeForm } from '@/components/v1/Register';

import './register.module.scss';

const Register = ({ query }) => {
  const { invitation_token: invitationToken, role } = query;

  return (
    <Layout containerClassName='auth-form' compareConnectAlert={false}>
      <CommitteeForm invitationToken={invitationToken} role={role} />
    </Layout>
  );
};

Register.getInitialProps = async ({ query }) => ({ query });

export default Register;

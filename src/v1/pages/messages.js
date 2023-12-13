import React, { useCallback, useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Loading } from '../src/components';
import { Message } from '../src/components/Messages';
import { getMessages, sendMessage, getCurrentMessages, archiveChatRoom } from '../src/actions/messages';
import { getOrgSpNumbers } from '../src/actions/spNumbers';
import { getOrgUsers } from '../src/actions/users';
import { messageConstants, userConstants } from '../src/constants';

import './messages.scss';

const ActionCableProvider = dynamic(() => import('react-actioncable-provider').then(mod => mod.ActionCableProvider), {
  ssr: false,
});

const Messages = ({ query }) => {
  const [showArchived, setShowArchived] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const id = parseInt(query.id, 10);
  const { createMessage, submitted } = query;
  const messages = useSelector(state => state.messages);
  const spList = useSelector(state => state.spNumbers.orgSpNumbers);
  const spListLoading = useSelector(state => state.spNumbers.loading);
  const currentUser = useSelector(state => state.auth.currentUser);
  const dispatch = useDispatch();

  const fetchMessages = async page => {
    await dispatch(getMessages({ page, showArchived, showAll }));
  };

  const handleOnChangeShowAll = useCallback(() => setShowAll(!showAll), [showAll, setShowAll]);

  const token = Cookie.get('access_token');

  useEffect(() => {
    if (id) {
      dispatch(getCurrentMessages(id));
    }
  }, [id]);

  useEffect(() => {
    // fetch only if there aren't any search filters
    // if there are search filters, Search component will fetch
    if (messages.searchFilters.length === 0) {
      fetchMessages({ page: 1 });
    }
  }, [createMessage, showArchived, showAll]);

  // Refetch chatrooms after creating new chatroom
  useEffect(() => {
    if (submitted) {
      fetchMessages({ page: 1 });
      Router.push(`/messages?id=${id}`);
    }
  }, [submitted]);

  // Fetch SP numbers list and Org users list
  useEffect(() => {
    const { organisation_id: orgId } = currentUser;
    if (!spList.length && spListLoading && orgId) {
      dispatch(getOrgSpNumbers(orgId));
    }
    if (orgId) {
      const role = userConstants.ORG_MANAGER_ROLES.join(',');
      const isActive = true;
      dispatch(getOrgUsers(orgId, role, isActive));
    }
  }, [currentUser]);

  if (messages.loading) {
    return <Loading />;
  }

  if (token) {
    return (
      <ActionCableProvider url={`${process.env.API_WS_ROOT}?token=${token}`}>
        <Message
          sendMessage={sendMessage}
          queryId={id}
          query={query}
          messageRes={messages}
          fetchMessages={fetchMessages}
          archiveChatRoom={archiveChatRoom}
          onChangeShowAll={handleOnChangeShowAll}
          showAll={showAll}
          showArchived={showArchived}
          toggleArchived={setShowArchived}
        />
      </ActionCableProvider>
    );
  }

  return null;
};

Messages.getInitialProps = async ({ query }) => ({
  query,
});

Messages.getLayout = page => (
  <Layout customSeo={messageConstants.SEO} headerClassName="mw-100" mainClassName="messages-content" hideBannersBar>
    {page}
  </Layout>
);

export default Messages;

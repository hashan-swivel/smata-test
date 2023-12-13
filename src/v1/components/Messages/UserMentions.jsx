import React from 'react';
import { Mention } from 'react-mentions';

export const UserMentions = (props) => {
  const { users, renderSuggestion } = props;
  return <Mention trigger='@' data={users} renderSuggestion={renderSuggestion} />;
};

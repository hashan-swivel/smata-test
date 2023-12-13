import React from 'react';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { formatDateOnly } from '../../../utils';
import { MessageItemPDF } from './MessageItemPDF';

const styles = StyleSheet.create({
  dateWrapper: {
    width: '100%',
    textAlign: 'center',
    margin: '10px 15px',
    position: 'relative'
  },
  date: {
    backgroundColor: '#fff',
    padding: '0px 20px',
    fontSize: '12px',
    color: '#333'
  }
});

export const MessagingMiddlePDF = (props) => {
  const { currentMessages, messageData, currentUser } = props;

  const historyMessage = (name) =>
    name.includes(currentUser.full_name) && name.includes('has deleted a message')
      ? 'You have deleted a message'
      : name;

  const trackMessageOwner = [];
  return (
    <View>
      <View>
        <Text style={{ marginLeft: 10 }}>{messageData.name}</Text>
        {Object.keys(currentMessages).map((keyName) => (
          <View key={keyName}>
            <View style={styles.dateWrapper}>
              <View style={styles.date}>
                <Text>{formatDateOnly(currentMessages[keyName][0].created_at)}</Text>
              </View>
            </View>
            {currentMessages[keyName].map((item, i) => {
              if (item.type === 'Message') {
                const itemCopy = { ...item };
                trackMessageOwner.push(item.sender.id);
                return (
                  <MessageItemPDF
                    item={itemCopy}
                    key={itemCopy.id}
                    index={trackMessageOwner.length - 1}
                    trackMessageOwner={trackMessageOwner}
                    showArchived={false}
                    currentUser={currentUser}
                  />
                );
              }

              trackMessageOwner.push(null);
              return (
                <View style={styles.dateWrapper} key={`${item.type}_${item.id}`}>
                  <View style={styles.date}>
                    <Text>{historyMessage(item.name)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

import React from 'react';
import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import { formatTimeOnly } from '../../../utils/dateTimeHelpers';
import { calculateAvatarColor } from '../../../utils/userHelpers';

const styles = StyleSheet.create({
  messageItem: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '16px',
    flexDirection: 'row'
  },
  wrapperCurrentUser: {
    flexDirection: 'row-reverse',
    marginRight: '10px'
  },
  messageBody: {
    minWidth: '50px',
    maxWidth: '70%'
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '7px',
    padding: '9px 17px',
    backgroundColor: '#EEE',
    fontSize: '15px',
    lineHeight: '1.55em'
  },
  currentUserMessageContainer: {
    backgroundColor: '#4FCBB2',
    color: '#fff'
  },
  sameOwner: {
    marginTop: '-10px'
  },
  paragraph: {
    display: 'flex',
    flexDirection: 'column'
  },
  metaContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  metaDate: {
    margin: '0px 10px',
    color: '#3535354d',
    fontSize: '12px'
  },
  metaItem: {
    fontSize: '12px',
    lineHeight: '12px'
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1px solid #333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0px 10px',
    fontSize: '12px'
  }
});

export const MessageItemPDF = ({ item, index, trackMessageOwner, currentUser }) => {
  const {
    sender,
    body,
    message_files: messageFiles,
    created_at: createdAt,
    updated_at: updatedAt
  } = item;
  const isCurrentUser = sender.id === currentUser?.id;
  const isSameMessageOwner = trackMessageOwner[index - 1] === trackMessageOwner[index];
  const timeStamp = () =>
    updatedAt && updatedAt > createdAt
      ? `${formatTimeOnly(updatedAt)} (edited)`
      : formatTimeOnly(createdAt);

  // Checks type of message sent (text, image or document) & renders accordingly
  const checkItemType = () => {
    const getFileExt = (filename) => {
      const parts = filename.split('.');
      return parts[parts.length - 1];
    };

    const acceptedTypes = ['jpg', 'jpeg', 'png'];

    // replace mention tags with mention names
    let formattedBody = body.replace(/(<span class="mention">)(.*?)(<\/span>)/g, '$2');

    // replace line breaks
    if (body.includes('<br />')) {
      formattedBody = formattedBody.split('<br />').map((segmant) => <Text>{segmant}</Text>);
    } else {
      formattedBody = <Text>{formattedBody}</Text>;
    }

    if (messageFiles.length > 0) {
      const messageFilesRendering = messageFiles.map((messageFile) => {
        const fileExt = getFileExt(messageFile.file_name);
        if (acceptedTypes.includes(fileExt)) {
          return (
            <View>
              <Link href={messageFile.file.url} target='_blank'>
                {messageFile.file.url}
              </Link>
            </View>
          );
        }
        return (
          <View>
            <Link href={messageFile.file.url} target='_blank'>
              {messageFile.file.url}
            </Link>
          </View>
        );
      });
      return (
        <View>
          <View>
            <Text>{formattedBody}</Text>
          </View>
          {messageFilesRendering}
        </View>
      );
    }

    return <View style={styles.paragraph}>{formattedBody}</View>;
  };

  return (
    <>
      {!item.is_deleted && (
        <View
          wrap={false}
          style={[
            styles.messageItem,
            isCurrentUser ? styles.wrapperCurrentUser : {},
            isSameMessageOwner ? styles.sameOwner : {}
          ]}
        >
          <View
            style={[
              styles.avatar,
              {
                borderColor: calculateAvatarColor(`${sender.first_name} ${sender.last_name}`),
                opacity: isSameMessageOwner ? 0 : 1
              }
            ]}
          >
            <Text>
              {sender.first_name.charAt(0).toUpperCase()}
              {sender.last_name?.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.messageBody}>
            <View
              style={[
                styles.messageContainer,
                isCurrentUser ? styles.currentUserMessageContainer : {}
              ]}
            >
              {checkItemType()}
            </View>
          </View>

          {isCurrentUser && (
            <View style={styles.metaContainer}>
              <View style={styles.metaItem} />
              <Text style={styles.metaDate}>{timeStamp()}</Text>
            </View>
          )}

          {!isCurrentUser && (
            <View style={styles.metaContainer}>
              <View style={styles.metaItem} />
              <Text style={styles.metaDate}>{timeStamp()}</Text>
            </View>
          )}
        </View>
      )}
    </>
  );
};

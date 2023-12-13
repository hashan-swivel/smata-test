import { Document, Page, View } from '@react-pdf/renderer';
import moment from 'moment';
import React from 'react';
import { DocumentSidebarPDF } from './DocumentSidebarPDF';
import { MessageSidebarPDF } from './MessageSidebarPDF';
import { MessagingMiddlePDF } from './MessagingMiddlePDF';

const MessagePDFDoc = ({ chatRoom, buildingProfile, currentUsers, currentUser }) => {
  const attachment =
    chatRoom.attachments && chatRoom.attachments.length ? chatRoom.attachments[0] : null;

  const groupedMessages = chatRoom.messages
    .concat(chatRoom.histories)
    .sort((a, b) =>
      a.created_at === b.created_at ? a.type.localeCompare(b.type) : a.created_at - b.created_at
    )
    .reduce((acc, msg) => {
      const date = moment.unix(msg.created_at).format('D-MMM-YYYY');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(msg);
      return acc;
    }, {});

  return (
    <Document>
      <Page>
        <View>
          {chatRoom.attachments.length > 0 && (
            <DocumentSidebarPDF
              documentData={chatRoom}
              docUrl={attachment && attachment.links && attachment.links.file_url}
            />
          )}
          <MessageSidebarPDF
            documentData={chatRoom}
            buildingProfile={buildingProfile}
            documentType={attachment && attachment.category}
          />
          <MessagingMiddlePDF
            currentMessages={groupedMessages}
            currentHistories={chatRoom.histories}
            currentUsers={currentUsers}
            messageData={chatRoom}
            currentUser={currentUser}
            showArchived={false}
          />
        </View>
      </Page>
    </Document>
  );
};

export default MessagePDFDoc;

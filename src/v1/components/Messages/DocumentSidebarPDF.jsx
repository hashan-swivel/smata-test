import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  wrapper: {
    fontSize: 12,
    margin: 10
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  downloadBtn: {
    textAlign: 'center',
    padding: 10,
    border: '1px solid #4FCBB2',
    color: '#333',
    marginBottom: 15
  }
});

export const DocumentSidebarPDF = ({ documentData, docUrl }) => {
  if (documentData) {
    const { attachments } = documentData;

    const { id: docId, display_name: displayName, category } = attachments[0];

    return (
      <View style={styles.wrapper}>
        <View>
          <View style={styles.title} className='chatroom-info-header'>
            <Text>{displayName}</Text>
          </View>
        </View>

        <View style={styles.downloadBtn}>
          <Link src={docUrl}>
            <Text>DOWNLOAD ({docUrl})</Text>
          </Link>
        </View>
        <View style={styles.downloadBtn}>
          <Link
            src={`${window.location.origin}/${
              category === 'invoice' ? 'invoice' : 'document-preview'
            }`}
            query={{ id: docId }}
          >
            View {category}
          </Link>
        </View>
      </View>
    );
  }
  return null;
};

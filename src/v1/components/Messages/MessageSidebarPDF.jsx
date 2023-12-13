import React from 'react';
import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import { userOptionObj } from '../../../utils/addLabelValue';
import { formatUserLabel } from '../../../utils/helpers';
import { calculateAvatarColor } from '../../../utils/userHelpers';

const styles = StyleSheet.create({
  container: {
    padding: '10px',
    fontSize: '14px',
    marginBottom: '30px'
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column'
  },
  boldText: {
    fontWeight: 700,
    fontSize: '16px',
    marginBottom: '10px'
  },
  planWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '30px',
    marginTop: '5px'
  },
  planItem: {
    marginRight: '10px',
    fontSize: 10
  },
  planDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    backgroundColor: '#000',
    marginRight: 5
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
  },
  user: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  userName: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  userRole: {
    fontSize: '12px'
  }
});

export const MessageSidebarPDF = ({ documentData, buildingProfile, documentType }) => {
  const location = documentData?.location;
  const mappedUsers = documentData.users?.map(userOptionObj);
  const organisationLogo = buildingProfile.building?.theme?.logo;
  const strataManager = buildingProfile.building.strata_manager;

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.boldText}>The building</Text>
        <Text>
          <Link
            src={`${window.location.href}/building-profile`}
            query={{ id: documentData.account.site_plan_id }}
            target='_blank'
          >
            {location.location_name}
          </Link>
        </Text>
        <View style={styles.planWrapper}>
          <View style={styles.planDot}></View>
          <Text style={styles.planItem}>Plan ID: {documentData.account.site_plan_id}</Text>
          <View style={styles.planDot}></View>
          <Text style={styles.planItem}>Lot: N/A</Text>
        </View>
        {documentType && (
          <View>
            <Text style={styles.boldText}>Type of document</Text>
            <Text style={{ marginLeft: 10, textTransform: 'uppercase', fontSize: 11 }}>
              {documentType}
            </Text>
          </View>
        )}
        <View>
          {(strataManager || organisationLogo) && (
            <View>
              <Text>Managed by: </Text>
              {strataManager.full_name && (
                <View>
                  <View style={styles.avatar}>
                    <Text>
                      {strataManager.firstName.charAt(0).toUpperCase()}
                      {strataManager.lastName?.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text>{` ${strataManager.full_name}`}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.boldText}>Contacts in this message</Text>
        {mappedUsers.map((user) => (
          <View style={styles.user} key={user.id}>
            <View style={styles.userName}>
              <View
                style={[
                  styles.avatar,
                  { borderColor: calculateAvatarColor(`${user.firstName} ${user.lastName}`) }
                ]}
              >
                <Text>
                  {user.firstName.charAt(0).toUpperCase()}
                  {user.lastName?.charAt(0).toUpperCase()}
                </Text>
              </View>

              <Text>{user.label}</Text>
            </View>
            <Text style={styles.userRole}>{formatUserLabel(user.role).toUpperCase()}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

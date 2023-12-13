import { useSelector } from 'react-redux';
import { Layout } from '@/components/v1';
import {
  Navigation,
  NotificationSettings,
  ProfileSettings,
  UpdatePassword,
  TwoFactorAuthentication,
  PrivacySettings
} from '@/components/v1/Settings/index';
import './settings.module.scss';

const SETTING_COMPONENTS = {
  profile: ProfileSettings,
  notifications: NotificationSettings,
  password: UpdatePassword,
  '2fa': TwoFactorAuthentication,
  privacy: PrivacySettings
};

const Settings = ({ query }) => {
  const { section, snooze_for: snoozeFor, unsubscribe } = query;
  const user = useSelector((state) => state.auth.currentUser);
  const SelectedSettingComponent = SETTING_COMPONENTS[section || 'profile'];

  return (
    <div className='account-settings-wrapper'>
      <Navigation settingsComponent={section || 'profile'} />
      <SelectedSettingComponent user={user} snoozeFor={snoozeFor} unsubscribe={unsubscribe} />
    </div>
  );
};

Settings.getInitialProps = async ({ query }) => ({
  query
});

Settings.getLayout = (page) => (
  <Layout hideBannersBar customSeo={{ title: 'Profile Setting', description: 'Profile Setting' }}>
    {page}
  </Layout>
);

export default Settings;

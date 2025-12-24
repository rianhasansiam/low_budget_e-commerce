import SimpleProfilePageWrapper from './SimpleProfilePageWrapper';

export const metadata = {
  title: 'My Profile - Digicam Market | Account Dashboard',
  description: 'Manage your Digicam Market account, view orders, and customize your preferences.',
  keywords: 'profile, account, orders, Digicam Market account, user dashboard',
  openGraph: {
    title: 'My Profile - Digicam Market | Account Dashboard',
    description: 'Manage your Digicam Market account, view orders, and customize your preferences.',
    type: 'website',
  },
};

export default function ProfilePage() {
  return <SimpleProfilePageWrapper />;
}
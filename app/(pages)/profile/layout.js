export async function generateMetadata() {
  return {
  title: "My Profile - Digicam Market | Account Management",
  description: "Manage your Digicam Market account, view order history, update personal information, and customize your camera preferences.",
  keywords: "profile, account, user settings, order history, Digicam Market account management",
    robots: 'noindex, nofollow', // Private page
    openGraph: {
  title: "My Profile - Digicam Market | Account Management",
  description: "Manage your Digicam Market account, view order history, update personal information, and customize your camera preferences.",
      type: 'website'
    }
  };
}

export default function ProfileLayout({ children }) {
  return children;
}
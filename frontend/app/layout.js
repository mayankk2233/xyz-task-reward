import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./globals.css";

export const metadata = {
  title: "TaskReward - Earn by completing tasks",
  description: "A premium platform to earn rewards by completing simple tasks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-[#09090b] text-[#FAFAFA]">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '808640249052-7lb8qi8qbnp9f7j30ubffpm5l8ss361k.apps.googleusercontent.com'}>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

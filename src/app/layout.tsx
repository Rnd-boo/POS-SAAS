import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthStoreProvider from "@/providers/auth-store-provider";
import { cookies } from "next/headers";
import { Profile } from "@/types/profiles";
import * as jose from "jose";
import { getJwtSecretKey } from "@/lib/jwt";
import ReactQueryProvider from "@/providers/react-query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

async function getProfileFromToken(token: string): Promise<Profile | null> {
  try {
    const { payload } = await jose.jwtVerify(token, getJwtSecretKey());
    return payload as Profile;
  } catch (err) {
    console.error("Invalid JWT", err);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("client_profile")?.value;
  let profile: Profile | null = null;

  if (token) {
    profile = await getProfileFromToken(token);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <AuthStoreProvider profile={profile || {}}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthStoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

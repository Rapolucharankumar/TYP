import type { Metadata } from "next";
import { ThemeProvider } from "../context/theme-context";
import { AuthProvider } from "../context/auth-context";
import OfflineBanner from "../components/OfflineBanner";
import { ErrorBoundary } from "../components/ErrorBoundary";
import CinematicOverlay from "../components/CinematicOverlay";
import PrismLoadingScreen from "../components/PrismLoadingScreen";
import CustomCursor from "../components/CustomCursor";
import "./globals.css";


export const metadata: Metadata = {
  title: {
    default: "The Youth Prism | Premium Editorial Magazine",
    template: "%s | The Youth Prism"
  },
  description: "The Youth Prism is an independent publication exploring technology, policy, healthcare, and global affairs through the lens of youth.",
  metadataBase: new URL("https://youthprism.com"),
  openGraph: {
    title: "The Youth Prism",
    description: "Premium editorial exploring tech, policy, health, and global affairs.",
    siteName: "The Youth Prism",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Youth Prism",
    description: "Premium editorial exploring tech, policy, health, and global affairs.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <AuthProvider>
          <ThemeProvider>
            <CustomCursor />
            <PrismLoadingScreen />
            <OfflineBanner />
            <CinematicOverlay />
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


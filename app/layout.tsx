export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface BusinessSetting {
  key: string;
  value: string;
}

// API removed - business settings will be loaded from new Express.js admin panel
async function getBusinessSettings(): Promise<BusinessSetting[] | null> {
  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBusinessSettings();

  if (!settings) {
    return {
      title: "Phone Mart",
      description: "Best Mobile Shop",
    };
  }

  const websiteName =
    settings.find((s) => s.key === "website_name")?.value ||
    "Like Telecom";
  const metaTitle =
    settings.find((s) => s.key === "meta_title")?.value || websiteName;
  const metaDescription =
    settings.find((s) => s.key === "meta_description")?.value || "";
  const siteIcon =
    settings.find((s) => s.key === "site_icon")?.value;

  return {
    title: {
      default: metaTitle,
      template: `%s | ${websiteName}`,
    },
    description: metaDescription,
    icons: {
      icon: siteIcon || "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            <Footer />
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  fontWeight: 500,
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

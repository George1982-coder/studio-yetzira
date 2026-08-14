import type { Metadata, Viewport } from "next";
import { Assistant, Heebo } from "next/font/google";
import { RegisterSW } from "@/components/RegisterSW";
import "./globals.css";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["500", "700", "900"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "גאורגי מצאידזה — בונה אתרים ודפי נחיתה",
  description: "פרילנס: אתרים ודפי נחיתה מותאמים אישית לעסקים ויוצרים.",
  applicationName: "GM Studio",
  appleWebApp: {
    capable: true,
    title: "GM Studio",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/gm-icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icons/icon-192.png"],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${heebo.variable}`}>
      <body style={{ margin: 0, fontFamily: "var(--font-assistant), Assistant, sans-serif" }}>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}

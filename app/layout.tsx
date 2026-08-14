import type { Metadata } from "next";
import { Assistant, Heebo } from "next/font/google";
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
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${heebo.variable}`}>
      <body style={{ margin: 0, fontFamily: "var(--font-assistant), Assistant, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

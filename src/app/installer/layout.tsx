import type { Metadata } from "next";
import "./installer.css";

export const metadata: Metadata = {
  title: "אינסטלציה מקצועית | שירות 24/7",
  description:
    "אינסטלטור מקצועי בהישג יד - נזילות, סתימות, התקנות ותיקונים. שירות זמין 24/7, מחיר הוגן ואחריות על העבודה.",
};

export default function InstallerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="installer-root">{children}</div>;
}

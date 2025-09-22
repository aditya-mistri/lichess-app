import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Lichess Explorer",
  description: "Explore Lichess profiles, leaderboards, and tournaments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}

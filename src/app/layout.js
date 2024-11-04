import localFont from "next/font/local";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/css/bootstrap.css"
import BootstrapClient from '@/components/bootstrap/BootstrapClient';
import '../lib/fontawesome'; // Import FontAwesome configuration
import NavBar from "./ui/navbar/navbar";

export const dynamic = "force-dynamic";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: {
    absolute: "",
    default: "Sneaker Cave",
    template: ""
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NavBar />
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}

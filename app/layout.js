import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata = {
  title: "TragicBricks - Discover Haunted Places",
  description: "Uncover the mysteries of abandoned and haunted places",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${playfair.variable} ${lato.variable} font-sans bg-gray-900 text-gray-100`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-gray-800 text-gray-300 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-xl font-serif mb-4">TragicBricks</h3>
                    <p className="text-sm italic">"Every brick tells a story… dare to uncover it."</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-serif mb-3">Quick Links</h4>
                    <ul className="space-y-2">
                      <li><a href="/about" className="hover:text-teal-400 transition-colors">About Us</a></li>
                      <li><a href="/contact" className="hover:text-teal-400 transition-colors">Contact</a></li>
                      <li><a href="/report" className="hover:text-teal-400 transition-colors">Report Location</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-serif mb-3">Connect</h4>
                    <ul className="space-y-2">
                      <li><a href="#" className="hover:text-teal-400 transition-colors">Twitter</a></li>
                      <li><a href="#" className="hover:text-teal-400 transition-colors">Instagram</a></li>
                      <li><a href="#" className="hover:text-teal-400 transition-colors">Facebook</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

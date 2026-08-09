import "./globals.css";
import Navbar from "@/components/Navbar";
import "@fontsource/inter";

export const metadata = {
  title: "Happy Game Hub",
  description: "Projeto FIAP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
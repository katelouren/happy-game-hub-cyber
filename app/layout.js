import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AssistantLauncher from "@/components/AssistantLauncher";
import "@fontsource/inter";

export const metadata = {
  title: {
    default: "Happy Game Hub",
    template: "%s | Happy Game Hub",
  },
  description:
    "Jogos e experiências educativas para desenvolver habilidades cognitivas e segurança digital.",
};

export const viewport = {
  colorScheme: "dark",
  themeColor: "#020817",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <a
          href="#conteudo-principal"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-lime-400 px-4 py-3 font-bold text-slate-950 transition focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <Navbar />
        <div id="conteudo-principal" tabIndex={-1}>
          {children}
        </div>
        <Footer />
        <AssistantLauncher />
      </body>
    </html>
  );
}

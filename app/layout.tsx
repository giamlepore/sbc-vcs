import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Plataforma Tech for VCs (SBC)",
  description: "Acesse a plataforma Tech for VCs aqui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* <script src="https://heyai.com.br/chat_embed.js?chatId=5cce6e81cf1e5f54ec8ee4431c5708f9&title=SBC%20AI&message=Me%20fa%C3%A7a%20perguntas%20sobre%20as%20aulas%20que%20voc%C3%AA%20assistiu%20com%20o%20Allan%2C%20ou%20mesmo%20perguntas%20complementares.&theme=dark"></script> */}
        {/* <script src="https://heyai.com.br/chat_embed.js?chatId=638c4c754bd987a3e5f8e79f1d7f2a19&title=Tech%20VC%20AI%20Specialist&message=Peça%20ajuda%20sobre%20qualquer%20coisa%20das%20aulas%20e%20materiais%20da%20plataforma%20Tech%20for%20VCs%20(SBC)&theme=dark"></script> */}

      </body>
    </html>
  );
}

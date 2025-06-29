import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export const metadata: Metadata = {
    title: "Ponto Seguro",
    description: "Encontre abrigos e se proteja contra eventos extremos. 💙",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <head suppressHydrationWarning>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            </head>
            <body>
                <Header></Header>
                <div className="min-h-screen">{children}</div>
                <Footer></Footer>
            </body>
        </html>
    );
}

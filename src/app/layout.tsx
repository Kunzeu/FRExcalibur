import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "../lib/providers/next-auth-provider";
import { ThemeProvider } from "../lib/contexts/theme-context";
import { MuiProvider } from "../lib/providers/mui-provider";
import AmplifyConfig from "@/components/auth/AmplifyConfig";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { RouteTracker } from "@/components/layout/RouteTracker";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "FR Excalibur",
    description: "Aplicación segura con AWS Cognito",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en-US" className={inter.variable} suppressHydrationWarning>
            <body className={inter.className}>
                <AmplifyConfig />
                <ThemeProvider>
                    <NextAuthProvider>
                        <MuiProvider>
                            <LayoutWrapper>
                                <RouteTracker />
                                {children}
                            </LayoutWrapper>
                        </MuiProvider>
                    </NextAuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/firebase/auth-provider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/theme-provider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RE Manager OS | Premium Real Estate Management",
  description: "The operating system for luxury real estate organizations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            <AuthProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </AuthProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}

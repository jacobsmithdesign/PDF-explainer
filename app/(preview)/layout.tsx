import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import MyThemeContext, {
  MyThemeContextProvider,
} from "../context/themeContext";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-pdf-support.vercel.app"),
  title: "PDF Support Preview",
  description: "Experimental preview of PDF support with the AI SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.className}`}>
      <body className="">
        <MyThemeContextProvider>
          <ThemeProvider attribute="class" enableSystem>
            <Toaster position="top-center" richColors />
            {children}
          </ThemeProvider>
        </MyThemeContextProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Finance AI",
  description: "AI-powered finance tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

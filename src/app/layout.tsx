import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";

export const metadata = {
  title: "SaasForge - Générateur de MVP SaaS avec IA",
  description: "Transformez votre idée en MVP SaaS complet en 60 secondes grâce à notre IA révolutionnaire. Sans coder. Sans attendre. Essayez SaasForge gratuitement !",
  keywords: "SaaS, MVP, IA, générateur, startup, no-code, prototype, hackathon, entrepreneur, création d'entreprise",
  authors: [{ name: "DOUTI Lamoussa" }],
  creator: "DOUTI Lamoussa",
  publisher: "SaasForge",
  robots: "index, follow",
  openGraph: {
    title: "SaasForge - Générateur de MVP SaaS avec IA",
    description: "Transformez votre idée en MVP SaaS complet en 60 secondes grâce à notre IA révolutionnaire.",
    type: "website",
    locale: "fr_FR",
    siteName: "SaasForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaasForge - Générateur de MVP SaaS avec IA",
    description: "Transformez votre idée en MVP SaaS complet en 60 secondes grâce à notre IA révolutionnaire.",
    creator: "@saasforge",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const themeColor = "#6B46C1";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
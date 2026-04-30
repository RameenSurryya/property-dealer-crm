import "./globals.css";

export const metadata = {
  title: "Property Dealer CRM",
  description: "CRM system for property dealers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
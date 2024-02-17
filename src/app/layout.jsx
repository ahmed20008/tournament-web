// import "./globals.css";
// import "bootstrap/dist/css/bootstrap.css";
import Script from "next/script";

export const metadata = {
  title: "Tournament App",
  description: "Tournament App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}

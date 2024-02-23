import "../assets/css/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import Script from "next/script";
import { Suspense } from "react";
import Loading from "./loading";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
      <body>
        <SkeletonTheme baseColor="#E3E3E3" highlightColor="#C0C4C1">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </SkeletonTheme>
      </body>
    </html>
  );
}


"use client";

import MyThree from "./three";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"><body>
      <MyThree/>
    </body>
      
    </html>
  );
}

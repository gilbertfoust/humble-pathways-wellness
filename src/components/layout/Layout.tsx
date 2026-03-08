import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC<{ children: React.ReactNode; hideFooter?: boolean }> = ({ children, hideFooter }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;

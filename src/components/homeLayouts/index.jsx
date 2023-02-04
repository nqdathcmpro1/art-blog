import React, { memo } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToHomepageButton from "./BackToHomepageButton";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <Navbar />
      {pathname !== "/" && <BackToHomepageButton />}
      <ScrollToTop />
      <main className="w-full min-h-[calc(100vh_-_10rem)] grid place-items-center p-5 md:p-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default memo(Layout);

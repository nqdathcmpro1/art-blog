import React, { memo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToHomepageButton from "./BackToHomepageButton";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  const { pathname } = useLocation();

  const accessToken = useSelector((state) => state.authReducer.accessToken);

  return (
    <div>
      {accessToken ? (
        <>
          <Navbar />
          {pathname !== "/" && <BackToHomepageButton />}
          <ScrollToTop />
          <main className="w-full min-h-[calc(100vh_-_10rem)] p-5 md:p-10 flex justify-center">
            <Outlet />
          </main>
          <Footer />
        </>
      ) : (
        <Navigate to="/auth/login" />
      )}
    </div>
  );
};

export default memo(Layout);

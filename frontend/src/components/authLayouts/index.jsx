import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const AuthLayouts = () => {
  const accessToken = useSelector((state) => state.authReducer.accessToken);

  return (
    <>
      {!accessToken ? (
        <div className="w-full h-screen bg-gradient-to-r from-purple-500 to-pink-500 bg-cover flex items-center justify-evenly p-5 overflow-auto">
          <div className="w-11/12 md:w-1/2 bg-slate-200 rounded-3xl border-black border-4 flex items-center justify-center">
            <Outlet />
          </div>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default AuthLayouts;

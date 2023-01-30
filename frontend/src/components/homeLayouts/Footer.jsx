import React from "react";

const Footer = () => {
  const date = new Date(Date.now()).getFullYear();
  return (
    <div className="w-[100%] h-20 text-lg font-semibold bg-slate-800 text-white flex items-center justify-center">
      <h1>© Copyrighted 2021 - {date}. All rights reserved</h1>
    </div>
  );
};

export default Footer;

import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const BackToHomepageButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div
      title="Back to Homepage"
      className="fixed hidden md:flex items-center justify-center top-28 left-10 w-14 h-14 rounded-full z-20 bg-white hover:bg-slate-200 cursor-pointer text-3xl font-extrabold"
      onClick={handleClick}
    >
      <ArrowLeftOutlined />
    </div>
  );
};

export default BackToHomepageButton;

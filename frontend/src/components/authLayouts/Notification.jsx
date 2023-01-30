import React, { useState, useEffect } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";


const Notification = ({ isError, children }) => {
  const [openNoti, setOpenNoti] = useState(false);

  useEffect(() => {
    setOpenNoti(isError)
  }, [isError])

  const handleCloseNoti = () => {
    setOpenNoti(false);
  };

  return (
    <div
      className={
        "w-full min-h-16 p-3 bg-red-300 rounded-lg overflow-hidden items-center justify-between border-2 border-red-700 " +
        `${openNoti ? "flex" : "hidden"}`
      }
    >
      <p className="w-9/12 text-sm italic box-border break-words text-red-700">
        {children}
      </p>
      <CloseCircleOutlined
        className="text-3xl flex items-center justify-center text-red-700 cursor-pointer"
        onClick={handleCloseNoti}
      />
    </div>
  );
};

export default Notification;

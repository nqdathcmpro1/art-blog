import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import ReactModal from "react-modal";
import SubmitButton from "./SubmitButton";

const AvatarModal = ({ isOpen, setIsOpen, handleChange }) => {
  const [avatar, setAvatar] = useState(null);
  const [scale, setScale] = useState(1);

  const editor = useRef(null);

  const customStyles = {
    overlay: {
      zIndex: 20,
    },
    content: {
      padding: "20px",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "40%",
      minWidth: "250px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      maxHeight: "700px",
      borderRadius: "0.75rem",
    },
  };

  const handleSetAvatar = async () => {
    const result = await editor?.current
      .getImageScaledToCanvas()
      .toDataURL("image/png");
    handleChange(result);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setAvatar(null);
  };

  const convertBaseUrl = (url) => {
    const reader = new FileReader();
    if (url) reader.readAsDataURL(url);

    reader.onload = () => {
      setAvatar(reader.result);
    };
  };

  return (
    <ReactModal
      style={customStyles}
      isOpen={isOpen}
      onRequestClose={handleClose}
      ariaHideApp={false}
    >
      {avatar ? (
        <>
          <AvatarEditor
            ref={editor}
            crossOrigin="anonymous"
            style={{ width: "100%", height: "auto", maxHeight: "700px" }}
            borderRadius={9999}
            image={avatar}
            scale={scale}
          />
          <div className="w-full h-8 flex items-center justify-between gap-3">
            <MinusOutlined className="w-1/12" />
          <input
            type="range"
            className="w-10/12"
            min={1}
            max={1.5}
            step={0.01}
            onChange={(e) => setScale(e.target.value)}
          />
          <PlusOutlined className="w-1/12" />
          </div>
        </>
      ) : (
        <>
          <label
            for="avatar"
            className="w-full h-16 cursor-pointer flex items-center justify-center border-8 border-dashed border-black rounded-lg"
          >
            <p className="font-xl font-bold">Add your file here</p>
          </label>
          <input
            id="avatar"
            className="hidden"
            type="file"
            onChange={(e) => convertBaseUrl(e.target.files[0])}
          />
        </>
      )}
      <div className="md:w-2/3 w-full flex items-center justify-between gap-5">
        <button className="text-xl font-bold">Cancel</button>
        <SubmitButton
          disabled={!avatar}
          loading={false}
          onClick={handleSetAvatar}
        >
          Accept
        </SubmitButton>
      </div>
    </ReactModal>
  );
};

export default AvatarModal;

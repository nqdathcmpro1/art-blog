import React from "react";
import ReactModal from "react-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { fetchDetailArt, deleteArt } from "@/api/artApi";

const DeleteModal = ({ deleteModalOpen, setDeleteModalOpen, handleDelete, children }) => {
  const customStyles = {
    overlay: {
      zIndex: 20,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "60%",
      maxHeight: "700px",
      borderRadius: "0.75rem",
    },
  };



  
  const handleSetCloseModal = () => {
    setDeleteModalOpen(false);
  };

  return (
    <ReactModal
      isOpen={deleteModalOpen}
      style={customStyles}
      onRequestClose={handleSetCloseModal}
      contentLabel="Example Modal"
      ariaHideApp={false}
    >
      <div className="rounded-xl h-full flex flex-col items-center justify-between gap-5">
        <h1 className="text-3xl font-extrabold">Delete</h1>
        <p className="text-xl break-words">
          {children}
        </p>
        <div className="w-full md:w-8/12 flex items-center justify-between">
          <button className="font-semibold" onClick={handleSetCloseModal}>
            Cancel
          </button>
          <button
            className="font-semibold bg-red-600 rounded-full px-2 py-1 text-white"
            onClick={handleDelete}
          >
            Accept
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default DeleteModal;

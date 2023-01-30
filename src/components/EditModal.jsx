import React from "react";
import ReactModal from "react-modal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import { fetchDetailArt, editArt } from "@/api/artApi";

const EditModal = ({ editModalOpen, setEditModalOpen, chosenArtId }) => {
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

  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["fetchEditArt", chosenArtId],
    queryFn: () => fetchDetailArt(chosenArtId),
  });

  const editArtMutation = useMutation({
    mutationKey: ["editArt"],
    mutationFn: (input) => {
      const { chosenArtId, values } = input;
      return editArt(chosenArtId, values);
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        navigate(`/art/${chosenArtId}`);
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      title: data?.data.data.title || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const input = { chosenArtId, values };
      editArtMutation.mutate(input);
    },
  });

  const handleSetCloseModal = () => {
    setEditModalOpen(false);
  };

  return (
    <ReactModal
      isOpen={editModalOpen}
      style={customStyles}
      onRequestClose={handleSetCloseModal}
      contentLabel="Example Modal"
      ariaHideApp={false}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="rounded-xl h-full flex flex-col items-center justify-between gap-5"
      >
        <h1 className="text-3xl font-extrabold">Edit</h1>
        <div className="w-full h-full flex items-center justify-between">
          <div className="w-1/3 h-full">
            <img
              className="w-full object-contain rounded-xl"
              src={data?.data.data.url}
            />
          </div>
          <div className="w-2/3 h-40 flex flex-col items-center justify-between">
            <input
              className="w-10/12 h-16 font-bold text-2xl rounded-full p-3"
              type="text"
              name="title"
              placeholder="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
            />
            <button
              type="submit"
              className=" bg-red-600 text-2xl font-semibold text-white rounded-full px-5 py-3"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </ReactModal>
  );
};

export default EditModal;

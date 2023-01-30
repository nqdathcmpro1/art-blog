import React from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";

import defaultAvatar from "@/public/default-avatar.png";
import { createArt } from "@/api/artApi";

const ArtCreate = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.authReducer.loginUser);

  const convertBaseUrl = (url) => {
    const reader = new FileReader();
    if (url) reader.readAsDataURL(url);

    reader.onload = () => {
      formik.setFieldValue("url", reader.result);
    };
  };

  const addImageMutation = useMutation({
    mutationKey: ["addImage"],
    mutationFn: (art) => {
      return createArt(art);
    },
    onSuccess: (data) => {
      if (data?.status === 200) navigate(`/art/${data?.data.data._id}`);
    },
  });

  const handleChange = (e) => {
    convertBaseUrl(e.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      url: "",
    },
    onSubmit: (values) => {
      const art = { ...values, author: user?._id };
      addImageMutation.mutate(art);
    },
  });

  return (
    <>
      {user ? (
        <form
          onSubmit={formik.handleSubmit}
          className="w-full md:w-10/12 p-5 rounded-2xl shadow-2xl flex items-center justify-between flex-col md:flex-row gap-5"
        >
          <div className="w-full md:w-1/3 min-w-[300px] select-none">
            <label
              htmlFor="upload"
              className="w-full rounded-2xl bg-slate-300 border-dashed border-slate-400 border-4 overflow-hidden flex flex-col items-center justify-center cursor-pointer"
            >
              {formik?.values.url ? (
                <img src={formik?.values.url} className="w-full" alt="art" />
              ) : (
                <div className="flex flex-col items-center justify-center my-16">
                  <PlusCircleOutlined className="text-6xl text-slate-500 font-extrabold" />
                  <p className="text-lg italic text-slate-500">
                    Click here to upload your Arts
                  </p>
                </div>
              )}
            </label>
            <input
              id="upload"
              type="file"
              name="url"
              className="hidden"
              onChange={handleChange}
            />
          </div>

          <div className="w-full md:w-2/3 flex flex-col gap-5">
            <input
              id="art-title"
              type="text"
              name="title"
              placeholder="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              className="w-full text-3xl font-bold border-none focus:outline-none"
            />
            <span className="h-16 flex items-center gap-3">
              <span className="w-16 rounded-full aspect-square overflow-hidden">
                <img
                  src={user?.avatar || defaultAvatar}
                  alt="avatar"
                  className="object-contain"
                />
              </span>
              <p className="text-lg font-semibold">{user?.userName}</p>
            </span>
            <button
              type="submit"
              className="w-30 mx-auto bg-red-600 hover:bg-red-700 px-14 py-3 text-white font-semibold rounded-full"
            >
              Send
            </button>
          </div>
        </form>
      ) : (
        <Navigate to="/auth/login" />
      )}
    </>
  );
};

export default ArtCreate;

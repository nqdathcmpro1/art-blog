import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authSlice } from "@/slices/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

import defaultAvatar from "public/default-avatar.png";
import { editUser, fetchAuthor } from "@/api/userApi";

const EditUser = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.loginUser);

  const { data, isFetching } = useQuery({
    queryKey: ["editUser"],
    queryFn: () => fetchAuthor(user?.userName),
  });

  const editUserMutation = useMutation({
    mutationKey: ["editUser"],
    mutationFn: (input) => {
      const { author, values } = input;
      return editUser(author, values);
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        dispatch(authSlice.actions.updateUser(data?.data.data));
        navigate(`/user/${user.userName}`);
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      avatar: data?.data?.data?.avatar || "",
      fullName: data?.data?.data?.fullName || "",
      email: data?.data?.data?.email || "",
      status: data?.data?.data?.status || "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(3, "At least 3 characters")
        .max(20, "Max 20 characters")
        .required("This field is required"),
      email: Yup.string()
        .matches(
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Email incorrect"
        )
        .required("This field is required"),
    }),

    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      const input = { author: user._id, values };
      editUserMutation.mutate(input);
    },
  });

  const convertBaseUrl = (url) => {
    const reader = new FileReader();
    if (url) reader.readAsDataURL(url);

    reader.onload = () => {
      formik.setFieldValue("avatar", reader.result);
    };
  };

  const handleChange = (e) => {
    convertBaseUrl(e.target.files[0]);
  };

  return (
    <>
      {user ? (
        <form
          onSubmit={formik.handleSubmit}
          className="w-full md:w-10/12 h-fit p-5 shadow-2xl rounded-2xl bg-slate-100 overflow-hidden flex flex-col items-center gap-5 md:flex-row"
        >
          <div className="w-full md:w-1/3 flex items-center justify-center">
            <label
              htmlFor="avatar"
              className="w-1/2 md:w-full aspect-square rounded-full overflow-hidden cursor-pointer"
            >
              <img
                src={formik.values.avatar || defaultAvatar}
                alt="avatar"
                className="object-contain"
                onChange={handleChange}
              />
            </label>
            <input
              id="avatar"
              type="file"
              name="avatar"
              onChange={handleChange}
              className="hidden"
            />
          </div>
          <div className="w-full md:w-2/3 h-full flex flex-col items-center justify-center gap-5">
            <input
              type="text"
              placeholder="Name"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              className="w-full bg-white text-lg md:text-xl font-semibold rounded-full p-5"
            />

            <input
              type="text"
              placeholder="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="w-full bg-white text-lg md:text-xl font-semibold rounded-full p-5"
            />
            <textarea
              type="text"
              placeholder="Status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              className="text-md font-semibold resize-none w-full h-32 rounded-xl p-5"
            />
            <button
              type="submit"
              className="w-32 p-1 font-semibold text-2xl text-white bg-red-600 hover:bg-red-700 rounded-full"
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

export default EditUser;

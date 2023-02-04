import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authSlice } from "@/slices/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

import defaultAvatar from "public/default-avatar.png";
import { editUser, fetchAuthor } from "@/api/userApi";
import SubmitButton from "@/components/SubmitButton";
import AvatarModal from "@/components/AvatarModal";

const EditUser = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const user = useSelector((state) => state.authReducer.loginUser);

  const [isOpenModal, setIsOpenModal] = useState(false)

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
        queryClient.invalidateQueries({ queryKey: ["editUser"] });
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

  const handleChange = (result) => {
    formik.setFieldValue("avatar", result);
  };

  const handleOpenAvatarModal = () => {
    setIsOpenModal(true)
  }

  return (
    <>
      {user ? (
        <form
          onSubmit={formik.handleSubmit}
          className="w-full md:w-10/12 h-fit p-5 shadow-2xl rounded-2xl bg-slate-100 overflow-hidden flex flex-col items-center gap-5 md:flex-row"
        >
          <div className="w-full md:w-1/3 flex items-center justify-center">
            <img onClick={handleOpenAvatarModal} className="md:w-5/6 w-1/2 cursor-pointer aspect-square rounded-full" src={formik?.values.avatar || defaultAvatar} />
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
            <SubmitButton loading={editUserMutation.isLoading}>
              Send
            </SubmitButton>
          </div>
        </form>
      ) : (
        <Navigate to="/auth/login" />
      )}
      <AvatarModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} handleChange={handleChange} />
    </>
  );
};

export default EditUser;

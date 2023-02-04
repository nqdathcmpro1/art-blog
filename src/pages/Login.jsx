import React, { useState,memo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import Input from "@/components/authLayouts/Input";
import SubmitButton from "@/components/SubmitButton";
import Notification from "@/components/authLayouts/Notification";

import { loginThunk } from "@/thunks/authThunk";

const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [loginError, setLoginError] = useState(null)

  const loading = useSelector(state => state.authReducer.loading)

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string()
        .min(6, "At least 6 characters")
        .max(15, "Max 15 characters")
        .required("This field is required"),
      password: Yup.string()
        .min(8, "At least 8 characters")
        .max(16, "Max 16 characters")
        .required("This field is required"),
    }),
    validateOnChange: false,
    validateOnBlur: false ,
    onSubmit: async (values) => {
      setLoginError(null)
      const data = await dispatch(loginThunk(values))
      if (data.meta.requestStatus === "fulfilled") navigate("/")
      else if (data.meta.requestStatus === "rejected") {
        setLoginError(data.payload)
      }
    }

    
  });

  return (
    <form className="w-10/12 md:p-3 p-1 flex flex-col items-center gap-5" onSubmit={formik.handleSubmit}>
      <h1 className="text-3xl font-extrabold">Log in</h1>
      <Notification isError={!!loginError}>{loginError}</Notification>
      <Input
        type="text"
        placeholder="Username"
        name="userName"
        value={formik.values.userName}
        onChange={formik.handleChange}
        disabled={loading}
        errorMessage={formik.errors.userName}
      />
      <Input
        type="password"
        placeholder="Password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        disabled={loading}
        errorMessage={formik.errors.password}
      />
      <SubmitButton loading={loading}>Log in</SubmitButton>
      <Link to="/auth/register">
        <p className="text-sm italic text-sky-600">
          Not having an account ? Register here.
        </p>
      </Link>
    </form>
  );
};

export default memo(Login);

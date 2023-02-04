import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";

import { registerUser } from "@/api/userApi";

import Input from "@/components/authLayouts/Input";
import SubmitButton from "@/components/SubmitButton";
import Notification from "@/components/authLayouts/Notification";

const Register = () => {
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (newUser) => {
      return registerUser(newUser);
    },
    onSuccess: () => navigate("/auth/login"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      userName: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(3, "At least 3 characters")
        .max(20, "Max 20 characters")
        .required("This field is required"),
      userName: Yup.string()
        .min(6, "At least 6 characters")
        .max(15, "Max 15 characters")
        .required("This field is required"),
      password: Yup.string()
        .min(8, "At least 8 characters")
        .max(16, "Max 16 characters")
        .required("This field is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Password is not match")
        .required("This field is required"),
      email: Yup.string()
        .matches(
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Email incorrect"
        )
        .required("This field is required"),
    }),
    validateOnBlur: true,
    onSubmit: (values) => registerMutation.mutate(values),
  });

  return (
    <form
      className="w-10/12 md:p-3 p-1 flex flex-col items-center gap-5"
      onSubmit={formik.handleSubmit}
    >
      <h1 className="text-3xl font-extrabold">Register</h1>
      <Notification isError={registerMutation.isError}>
        {registerMutation?.error?.response.data.message}
      </Notification>

      <Input
        type="text"
        placeholder="Fullname"
        name="fullName"
        disabled={registerMutation.isLoading}
        value={formik.values.fullName}
        onChange={formik.handleChange}
        errorMessage={formik.errors.fullName}
      />
      <Input
        type="text"
        placeholder="Username"
        name="userName"
        disabled={registerMutation.isLoading}
        value={formik.values.userName}
        onChange={formik.handleChange}
        errorMessage={formik.errors.userName}
      />
      <Input
        type="password"
        placeholder="Password"
        name="password"
        disabled={registerMutation.isLoading}
        value={formik.values.password}
        onChange={formik.handleChange}
        errorMessage={formik.errors.password}
      />
      <Input
        type="password"
        placeholder="Confirm Password"
        name="confirmPassword"
        disabled={registerMutation.isLoading}
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        errorMessage={formik.errors.confirmPassword}
      />
      <Input
        type="text"
        placeholder="Email"
        name="email"
        disabled={registerMutation.isLoading}
        value={formik.values.email}
        onChange={formik.handleChange}
        errorMessage={formik.errors.email}
      />

      <SubmitButton loading={registerMutation.isLoading}>Register</SubmitButton>

      <Link to="/auth/login">
        <p className="text-sm italic text-sky-600">
          Already had an account ? Log in here.
        </p>
      </Link>
    </form>
  );
};

export default Register;

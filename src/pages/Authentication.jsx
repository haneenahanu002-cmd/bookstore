import React, { useState ,useContext} from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import {  registerAPI } from "../services/allApi";
import { loginAPI } from "../services/allApi";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { googleloginAPI } from "../services/allApi";
import { routerContext } from "../context/RouterGuardContext.jsx";


function Authentication({ register }) {
  const { setRole, setAuthorizedUser } = useContext(routerContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "demo",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      ...(register && {
        username: Yup.string()
          .min(3, "Must be at least 3 characters")
          .required("Required"),
      }),

      email: Yup.string()
        .email("Invalid email")
        .required("Required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),

      ...(register && {
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], "Passwords do not match")
          .required("Required"),
      }),
    }),

    onSubmit: async (values) => {


      if (register) {
        try {
          const userData = {
            username: values.username.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password,
          };

          const result = await registerAPI(userData);

          console.log("Register API Response:", result.data);

          // Success alert only when registration succeeds
          if (result.status === 201) {
            alert("Registration successful! Please login.");
            formik.resetForm();
            navigate("/login");
          }
        } catch (error) {
          console.log("Register API Error:", error.response?.data);

          // Duplicate email
          if (error.response?.status === 409) {
            alert(
              error.response.data.message ||
              "User already exists. Please login."
            );
          } else {
            alert(
              error.response?.data?.message ||
              "Registration failed. Please try again."
            );
          }
        }
      } else {
        await handlelogin({
          email: values.email.trim().toLowerCase(),
          password: values.password,
        });
      }


    },
  });

  const handlelogin = async (userData) => {
    try {
      const result = await loginAPI(userData);

      if (result.status === 200) {
        const user = result.data.user;
        const token = result.data.token;

        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", token);

        window.dispatchEvent(new Event("loginStatusChanged"));

        toast.success("Login successful!");

        if (user?.role === "admin") {
          setRole("admin");
          navigate("/admin-dashboard");
        } else {
          setRole("user");
          navigate("/");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.log("Login error:", error.response?.status, error.response?.data);

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404) {
        toast.error("You are not registered. Please register first!");
      } else if (status === 401) {
        toast.error("Invalid email or password!");
      } else {
        toast.error(message || "Login failed. Please try again.");
      }
    }
  };
  const handleGoogleLogin= async (credentialResponse)=>{
    console.log("inside google login")
    const {name,email,picture} =jwtDecode(credentialResponse.credential)

    const res = await googleloginAPI({username:name,email,password:"googlepassword",picture})
    console.log(res);
    if(res.status==200){
      toast.success("login successfully")
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
        sessionStorage.setItem("token", res.data.token);
        setAuthorizedUser(true);
        setTimeout(() => {
          setRole('user')
          navigate('/')
        }, 2500);

    }

  }


  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-[url('./assets/background.jpg')]">
      <div className="p-5 sm:p-10">
        <h1 className="text-center text-4xl font-bold text-white">
          Book Store
        </h1>

        <div className="mx-auto mt-10 w-full max-w-md rounded-lg bg-black/80 p-6 text-white sm:p-8">
          <div className="flex justify-center">
            <FontAwesomeIcon
              icon={faUser}
              className="rounded-full border-2 border-white p-4 text-4xl"
            />
          </div>

          <h2 className="mt-6 text-center text-3xl font-bold">
            {register ? "Create Account" : "Welcome Back"}
          </h2>

          <p className="mt-2 text-center text-gray-300">
            {register
              ? "Register to continue"
              : "Login to your account"}
          </p>

          <form className="mt-8" onSubmit={formik.handleSubmit}>
            {register && (
              <div className="mb-4">
                <label className="mb-2 block">Name</label>
                <input
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your name"
                  className="w-full rounded-md border border-gray-500 bg-white p-3 text-black outline-none focus:border-blue-500"
                />

                {formik.touched.username && formik.errors.username && (
                  <p className="mt-1 text-sm text-red-400">
                    {formik.errors.username}
                  </p>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="mb-2 block">Email</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-500 bg-white p-3 text-black outline-none focus:border-blue-500"
              />

              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-gray-500 bg-white p-3 pr-12 text-black outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>

              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {register && (
              <div className="mb-4">
                <label className="mb-2 block">Confirm Password</label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Confirm your password"
                    className="w-full rounded-md border border-gray-500 bg-white p-3 pr-12 text-black outline-none focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    <FontAwesomeIcon
                      icon={
                        showConfirmPassword ? faEyeSlash : faEye
                      }
                    />
                  </button>
                </div>

                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>
            )}

            {register && (
              <p className="mt-2 text-center text-yellow-500">
                * Never share your password with others
              </p>
            )}

            {!register && (
              <div className="mb-4 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="mt-4 w-full rounded-md bg-blue-700 p-3 font-semibold hover:bg-blue-800 disabled:opacity-60"
            >
              {formik.isSubmitting
                ? "Please wait..."
                : register
                  ? "Register"
                  : "Login"}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-gray-500" />
            <span className="px-4 text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-500" />
          </div>

          <button
            type="button"
            onClick={() =>
              alert("Google authentication is not configured yet.")
            }
            className="flex w-full items-center justify-center gap-3 rounded-md bg-black-500 p-3 font-semibold text-gray-800 hover:bg-gray-200"
          > <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(credentialResponse);
                handleGoogleLogin(credentialResponse)
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />

          </button>

          <p className="mt-6 text-center text-gray-300">
            {register ? (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-400 hover:underline"
                >
                  Login
                </Link>


              </>


            ) : (
              <>

                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-400 hover:underline"
                >
                  Register
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
export default Authentication;
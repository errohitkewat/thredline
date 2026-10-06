import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../api/authApi";
import { setCredentials } from "../AuthSlice";
import { useState } from "react";


const RegisterPage = () => {


  const { register, handleSubmit, formState: { isSubmitting, errors }, getValues } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("")


  const onSubmit = async (data) => { 
    try {
      setServerError("");
      const response = await registerUser(data);
      console.log(response);
      dispatch(setCredentials({ user: response.data.user, accessToken: response.accessToken }))
      navigate("/");
    }
    catch (error) {
      setServerError(error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Something went wrong!");
    }
  }


  return (
    <div className="grid min-h-dvh bg-white text-black lg:grid-cols-2">

      {/* LEFT: brand panel (sirf bade screen par dikhega) */}
      <div className="hidden flex-col justify-between bg-black p-12 text-white lg:flex">
        <h1 className="text-2xl font-bold tracking-[0.3em]">YOUR BRAND</h1>

        <div>
          <p className="text-4xl font-light leading-tight tracking-wide">
            Join the
            <br />
            minimal club.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-neutral-400">
            Create your account in a minute
          </p>
        </div>

        <p className="text-xs tracking-widest text-neutral-500">© 2026 YOUR BRAND</p>
      </div>

      {/* RIGHT: form */}
      <div className="flex items-center justify-center px-6 py-6 sm:py-12">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold uppercase tracking-widest sm:text-3xl">Register</h2>
          <p className="mt-1 text-sm text-neutral-500 sm:mt-2">
            Create an account to start shopping.
          </p>

          {/* ERROR MESSAGE: logic ke time yahan serverError dikhana hai */}
          {serverError && <p className="mt-4 border border-black bg-neutral-100 px-4 py-3 text-sm">{serverError}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3.5 sm:mt-8 sm:space-y-5">
            <div>
              <label htmlFor="name" className="text-xs font-medium uppercase tracking-widest">
                Name
              </label>
              <input
                { ...register("name") }
                id="name"
                type="text"
                placeholder="Your full name"
                className="mt-1.5 w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none transition focus:border-black sm:mt-2 sm:py-3"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-widest">
                Email
              </label>
              <input
                { ...register("email") }
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1.5 w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none transition focus:border-black sm:mt-2 sm:py-3"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-medium uppercase tracking-widest">
                Password
              </label>
              <input
                { ...register("password") }
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1.5 w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none transition focus:border-black sm:mt-2 sm:py-3"
              />
              <p className="mt-1 text-[11px] text-neutral-400 sm:text-xs">
                Min 6 characters, one capital letter and one number
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-xs font-medium uppercase tracking-widest">
                Confirm password
              </label>
              <input
                {...register("confirmPassword", {
                  validate: (value) => value === getValues("password") || "Password do not match!"
                })}
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="mt-1.5 w-full border border-neutral-300 px-4 py-2.5 text-sm outline-none transition focus:border-black sm:mt-2 sm:py-3"
              />
              {errors.confirmPassword?.message && <p className="mt-1 text-[11px] text-red-600 sm:text-xs">{ errors.confirmPassword.message }</p>}
            </div>

            <button
              disabled={ isSubmitting }
              type="submit"
              className="w-full bg-black py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5"
            >
              { isSubmitting ? "Creating Account..." : "Create Account" }
            </button>
          </form>

          <p className="mt-5 text-center text-xs uppercase tracking-widest text-neutral-500 sm:mt-8">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-black underline underline-offset-4">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../api/authApi";
import { setCredentials } from "../AuthSlice";
import { useState } from "react";


const LoginPage = () => {

    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [serverError, setServerError] = useState("");



    const onSubmit = async (data) => { 
        try {
            setServerError("");
            const response = await loginUser(data);
    
            dispatch(setCredentials({ user: response.data.user, accessToken: response.accessToken }));
            navigate("/");
        } catch (error) {
            setServerError(error.response?.data?.message || "Something went wrong!");
        }
    }

    return (
        <div className="grid min-h-screen bg-white text-black lg:grid-cols-2">
            {/* LEFT: brand panel (sirf bade screen par dikhega) */}
            <div className="hidden flex-col justify-between bg-black p-12 text-white lg:flex">
                <h1 className="text-2xl font-bold tracking-[0.3em]">THREADLINE</h1>
        
                <div>
                    <p className="text-4xl font-light leading-tight tracking-wide">
                        Dress sharp. <br /> Stay minimal.
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.25em] text-neutral-400">
                        New season · Now live
                    </p>
                </div>
        
                <p className="text-xs tracking-widest text-neutral-500">
                    © 2026 THREADLINE
                </p>
            </div>
      
            {/* RIGHT: form */}
            <div className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    <h2 className="text-3xl font-semibold uppercase tracking-widest">
                        Login
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                        Welcome back. Enter your details to continue.
                    </p>
          
                    {/* ERROR MESSAGE: logic ke time yahan error dikhana hai (neeche diya hai) */}
                    {serverError && <p className="mt-6 border border-black bg-neutral-100 px-4 py-3 text-sm">{serverError}</p>}
          
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="text-xs font-medium uppercase tracking-widest"
                            >
                                Email
                            </label>
                            <input
                                { ...register("email")}
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                className="mt-2 w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                            />
                        </div>
            
                        <div>
                            <label
                                htmlFor="password"
                                className="text-xs font-medium uppercase tracking-widest"
                            >
                                Password
                            </label>
                            <input
                                { ...register("password")}
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="mt-2 w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                            />
                        </div>
            
                        <button
                            disabled={ isSubmitting }
                            type="submit"
                            className="w-full bg-black py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            { 
                                isSubmitting ? "Logging In..." : "Login"
                            }
                        </button>
                    </form>
          
                    <p className="mt-8 text-center text-xs uppercase tracking-widest text-neutral-500">
                        New here?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-black underline underline-offset-4"
                        >
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

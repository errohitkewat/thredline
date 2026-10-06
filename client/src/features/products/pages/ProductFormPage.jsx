import { useForm } from "react-hook-form";
import { Link } from "react-router";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const inputClass = "mt-2 w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-black";
const labelClass = "text-xs font-medium uppercase tracking-widest";


const ProductFormPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();


    const onSubmit = async (data) => { 
        console.log(data);
        console.log(errors)
    }



    return (
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
    
            {/* Heading */}
            <div className="mb-8 border-b border-neutral-200 pb-6">
                <Link
                    to="/seller"
                    className="text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-black"
                >
                    &larr; Back to dashboard
                </Link>
                <h1 className="mt-4 text-xl font-semibold uppercase tracking-[0.25em] sm:text-2xl">
                    Add Product
                </h1>
            </div>
      
            {/* ERROR MESSAGE: logic ke time yahan serverError dikhana hai */}
            {/* <p className="mb-6 border border-black bg-neutral-100 px-4 py-3 text-sm">{serverError}</p> */}
      
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      
                {/* Title */}
                <div>
                    <label htmlFor="title" className={labelClass}>Title</label>
                    <input
                        { ...register("title",{
                            required: "Title is required",
                            minLength: {
                                value: 10,
                                message: "Title must be at least 10 characters long",
                            },
                            maxLength: {
                                value: 100,
                                message: "Tittle can not have more than 100 characters",
                            },
                        })}
                        id="title"
                        type="text"
                        placeholder="Oversized Black Tee"
                        className={inputClass}
                    />
                    <p className="mt-1.5 text-xs text-neutral-400">10 - 100 characters</p>
                    {
                        errors.title?.message && <p className="mt-1.5 text-xs text-red-600">{errors.title?.message}</p>
                    }
                </div>
        
                {/* Description */}
                <div>
                    <label htmlFor="description" className={labelClass}>Description</label>
                    <textarea
                        {...register("description", {
                            required: "Description is required",
                            minLength: { value: 20, message: "Description must be at least 20 characters long" },
                            maxLength: { value: 500, message: "Description cannot have more than 500 characters" },
                        })}
                        id="description"
                        rows={4}
                        placeholder="Write about fabric, fit and care..."
                        className={inputClass}
                    />
                    <p className="mt-1.5 text-xs text-neutral-400">20 - 500 characters</p>
                    {
                        errors.description?.message && <p className="mt-1.5 text-xs text-red-600">{errors.description?.message}</p>
                    }
                </div>
        
                {/* Price */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="amount" className={labelClass}>Price</label>
                        <input
                            {...register("amount", {
                                min: {
                                    value: 0.1,
                                    message: "Amount cannot be zero"
                                },
                                required: "Amount is required"
                            })}
                            id="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="1499"
                            className={inputClass}
                        />
                        {
                            errors.amount?.message && <p className="mt-1.5 text-xs text-red-600">{errors.amount?.message}</p>
                        }
                    </div>
          
                    <div>
                        <label htmlFor="currency" className={labelClass}>Currency</label>
                        <select
                            {...register("currency")}
                            id="currency"
                            className={inputClass}
                        >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                </div>
        
                {/* Sizes */}
                <div>
                    <p className={labelClass}>Sizes &amp; stock</p>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {ALL_SIZES.map((size) => (
                            <div key={size} className="border border-neutral-200 p-3">
                                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                                    <input type="checkbox" className="h-4 w-4 accent-black" />
                                    {size}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Stock"
                                    className="mt-2 w-full border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-black"
                                />
                            </div>
                        ))}
                    </div>
                </div>
        
                {/* Images */}
                <div>
                    <p className={labelClass}>Images</p>
                    <p className="mt-1.5 text-xs text-neutral-400">
                        Up to 7 images, max 2MB each
                    </p>
          
                    {/* PREVIEWS: logic ke time yahan chuni hui images dikhayenge */}
                    <div className="mt-3 flex flex-wrap gap-3">
                        {/* abhi khaali */}
                    </div>
          
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="mt-3 w-full text-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-black file:px-5 file:py-2.5 file:text-xs file:font-semibold file:uppercase file:tracking-[0.2em] file:text-white hover:file:bg-neutral-800"
                    />
                </div>
        
                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        className="flex-1 bg-black py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Create product
                    </button>
          
                    <Link
                        to="/seller"
                        className="border border-black px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.25em] transition hover:bg-black hover:text-white"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;
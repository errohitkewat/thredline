import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { logoutUser } from "../features/auth/api/authApi";
import { clearCredentials } from "../features/auth/AuthSlice";




const Navbar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isAuthenticated } = useSelector(state => state.auth);



  // Logout handler 
  const handleLogout = async () => {
    const isSure = (window.confirm("Are you sure you want to logout?"));

    try {
      if (isSure) { 
        await logoutUser();
      }
    }
    catch (error) {
      console.log(error.message);
    }
    finally { 
      if (isSure) { 
        dispatch(clearCredentials());
        navigate("/login");
      }
    }
  }


  const linkClass = "text-xs font-medium uppercase tracking-[0.2em] hover:underline underline-offset-4";

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Brand */}
        <Link to="/" className="text-lg font-bold tracking-[0.3em]">
        THREADLINE
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className={linkClass}>Shop</Link>

          {isAuthenticated && user?.role === "seller" && (
            <>
              <Link to="/seller" className={linkClass}>Dashboard</Link>
              <Link to="/seller/products/new" className={linkClass}>Add Product</Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Hi, {user?.name}
              </span>
              <button onClick={handleLogout} className="border border-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-black hover:text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>Login</Link>
              <Link
                to="/register"
                className="bg-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-xs font-semibold uppercase tracking-[0.2em] md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col gap-5 border-t border-neutral-200 bg-white px-6 py-5 md:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)} className={linkClass}>Shop</Link>

          {isAuthenticated && user?.role === "seller" && (
            <>
              <Link to="/seller" onClick={() => setMenuOpen(false)} className={linkClass}>Dashboard</Link>
              <Link to="/seller/products/new" onClick={() => setMenuOpen(false)} className={linkClass}>Add Product</Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Hi, {user?.name}</span>
              <button onClick={handleLogout} className="w-full border border-black py-3 text-xs font-semibold uppercase tracking-[0.2em]">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className={linkClass}>Login</Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-black py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;


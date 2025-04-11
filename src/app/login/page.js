"use client";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader.js";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const [role, setRole] = useState(null); 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(
          errorResponse.message || "Prihlásenie zlyhalo, skúste to znova."
        );
      }

      const result = await res.json();
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: result.data,
          token: result.token,
          role: result.role,
        },
      });

      setLoading(false);
      toast.success(result.message);
      router.push("/");
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <section className="px-5 lg:px-[700px]">
      <div className="w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        {!role ? (
    
          <div className="text-center">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-6">
              Vyberte typ prihlásenia
            </h3>
            <button
              onClick={() => setRole("user")}
              className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 mb-4"
            >
              Prihlásiť sa ako používateľ
            </button>
            <button
              onClick={() => setRole("admin")}
              className="w-full bg-red-500 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
            >
              Prihlásiť sa ako admin
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              {role === "user" ? "Prihlásiť sa ako používateľ" : "Prihlásiť sa ako admin"}
            </h3>
            <form className="py-4 md:py-0" onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Zadajte Váš email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                  focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
                  placeholder:text-textColor rounded-md cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="password"
                  placeholder="Zadajte heslo"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                  focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
                  placeholder:text-textColor rounded-md cursor-pointer"
                  required
                />
              </div>
              <div className="mt-7">
                <button
                  type="submit"
                  className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                >
                  {loading ? <HashLoader size={25} color="#fff" /> : "Prihlásiť sa"}
                </button>
              </div>

              {role === "user" && (
                <p className="mt-5 text-textColor text-center">
                  Nemáte účet?
                  <Link
                    href="/Signup"
                    className="text-primaryColor font-medium ml-1"
                  >
                    Registrácia
                  </Link>
                </p>
              )}

              <p
                className="mt-3 text-primaryColor text-center cursor-pointer"
                onClick={() => setRole(null)} 
              >
                Naspäť na možnosti prihlásenia
              </p>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

export default Page;

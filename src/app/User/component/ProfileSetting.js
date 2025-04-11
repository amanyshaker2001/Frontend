"use client";
import { toast } from "react-toastify";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import useFetchData from "@/app/hooks/useFetchData";
import { useRouter } from "next/navigation";

const ProfileSettings = () => {
  const { user, dispatch } = useContext(AuthContext);
  const userId = user?._id;
  const router = useRouter();

  const { data: userData, error, loading } = useFetchData(
    `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}`
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    gender: "",
    phone: "",
  });

  const [timeoutReached, setTimeoutReached] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

 
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "",
        gender: userData.gender || "",
        phone: userData.phone || "", 
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          gender: formData.gender,
          phone: formData.phone ? Number(formData.phone) : null, 
        }),
      });
  
      if (!res.ok) throw new Error("Nepodarilo sa aktualizovať profil");
  
      const result = await res.json();
      toast.success(result.message || "Profil úspešne aktualizovaný!");
  
      const updatedUser = {
        ...user,
        name: formData.name,
        gender: formData.gender,
        phone: formData.phone,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
    } catch (error) {
      toast.error("Nepodarilo sa aktualizovať profil.");
    }
  };
  

  const handleDelete = async () => {
    if (!confirm("Určite chcete odstrániť účet?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Nepodarilo sa odstrániť účet");

      toast.success("účet úspešne odstránený!");
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
      router.push("/");
    } catch (error) {
      toast.error("Nepodarilo sa odstrániť účet.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Nastavenia účtu</h2>

      {timeoutReached && !userData && <p className="text-red-500">Chyba pri načítani dát používateľa.</p>}

      <div className="mb-4">
        <label className="block text-gray-700">Prihlasovacie meno:</label>
        <input
          type="text"
          name="name"
          value={loading ? "Loading..." : formData.name}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-2 border rounded-md mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Email:</label>
        <input
          type="email"
          name="email"
          value={loading ? "Loading..." : formData.email}
          className="w-full px-4 py-2 border rounded-md mt-1 bg-gray-100"
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Rola:</label>
        <input
          type="text"
          name="role"
          value={loading ? "Loading..." : formData.role}
          className="w-full px-4 py-2 border rounded-md mt-1 bg-gray-100"
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Telefónne číslo:</label>
        <input
          type="tel"
          name="phone"
          value={loading ? "Loading..." : formData.phone}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-2 border rounded-md mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Pohlavie:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-2 border rounded-md mt-1"
        >
          <option value="">Vybrať</option>
          <option value="male">muž</option>
          <option value="female">žena</option>
        </select>
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 disabled:bg-gray-400"
      >
        Aktualizovať
      </button>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="w-full bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-600 disabled:bg-gray-400"
      >
        Odstrániť účet
      </button>
    </div>
  );
};

export default ProfileSettings;

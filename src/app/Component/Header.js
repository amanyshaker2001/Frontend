"use client";
import { useEffect, useRef, useState, useContext } from "react";
import Link from "next/link";
import { BiMenu, BiX } from "react-icons/bi";
import { AuthContext } from "../context/AuthContext";

const navLinks = [
  { path: "/", display: "Domov" },
  { path: "/Contact", display: "Kontakt" },
  { path: "/Search", display: "Vyhľadať knihu" },
];

const Header = () => {
  const { user, role, token, dispatch } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    window.location.href = "/";
  };
  

  return (
    <header className="bg-white shadow-md py-6 w-full">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <h1 className="text-xl font-bold">Knižničný systém</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link, index) => (
            <Link key={index} href={link.path} className="text-gray-700 hover:text-primaryColor font-medium">
              {link.display}
            </Link>
          ))}
        </nav>

        {/*  mobile Menu  */}
        <div className="flex items-center gap-4 relative">
          {token && user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="font-semibold">
                {user?.name}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg py-2">
                  <Link href={`/${role === "admin" ? "Admin" : "User"}`}>
                    <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{role === "admin" ? "Správa systému" : "Používateľský panel"}</p>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    odhlásiť sa
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="bg-primaryColor text-white py-2 px-4 rounded-lg font-medium">
              Prihlásiť sa
            </Link>
          )}

          {/* Mobile Menu  */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <BiX className="w-6 h-6" /> : <BiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

    
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg py-4">
          <nav className="flex flex-col items-center gap-4">
            {navLinks.map((link, index) => (
              <Link key={index} href={link.path} className="text-gray-700 hover:text-primaryColor font-medium">
                {link.display}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

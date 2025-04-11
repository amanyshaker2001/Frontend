"use client";
import React, { useState, useContext } from "react";
import ProfileSettings from "./component/ProfileSetting";
import BookingsList from "./component/BookList";
import FinePayment from "./component/FinePayment";
import UserBorrowedBooks from "./component/UserBorrowedBooks";

const UserPanel = () => {

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex space-x-4 border-b pb-2">
        <button
          className={`px-4 py-2 text-lg ${activeTab === "profile" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Nastavenia účtu
        </button>
        <button
          className={`px-4 py-2 text-lg ${activeTab === "bookings" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          Moje rezervácie
        </button>
        <button
          className={`px-4 py-2 text-lg ${activeTab === "fine" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("fine")}
        >
          Pokuty
        </button>
        <button
          className={`px-4 py-2 text-lg ${activeTab === "Borrow" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("Borrow")}
        >
          Pôžičky
        </button>
      </div>

      {activeTab === "profile" && <ProfileSettings/>}
      {activeTab === "bookings" && <BookingsList />}
      {activeTab === "fine" && <FinePayment />}
      {activeTab === "Borrow" && <UserBorrowedBooks />}
    </div>
  );
};

export default UserPanel;

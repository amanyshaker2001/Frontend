"use client";
import React, { useEffect, useState } from "react";

const ShowBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(false);

  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/booking`);
      if (!response.ok) throw new Error("nepodarilo sa načítať knihy");
      const data = await response.json();
      setBookings(data);

     
      const bookPromises = data.map((booking) =>
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/book/${booking.book}`)
          .then((res) => res.json())
          .catch(() => null)
      );

      const booksData = await Promise.all(bookPromises);
      const booksMap = data.reduce((acc, booking, index) => {
        acc[booking.book] = booksData[index]?.title || "neznáma kniha";
        return acc;
      }, {});

      setBooks(booksMap);
    } catch (error) {
      console.error("Error pri načítani kníh:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  
  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/booking/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Nepodarilo sa aktualizovať stav.");
      fetchBookings(); 
    } catch (error) {
      console.error("Chyba pri aktualizácii stavu:", error);
    }
  };

  
  const deleteBooking = async (id) => {
    if (!window.confirm("Určite chcete odstrániť túto rezerváciu?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/booking/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Nepodarilo sa odstrániť");
      fetchBookings(); 
    } catch (error) {
      console.error("Nepodarilo sa odstrániť:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">Rezervácie</h2>

      {loading ? (
        <p className="text-center">Načítava sa...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border border-gray-300 p-2">#</th>
              <th className="border border-gray-300 p-2">Meno</th>
              <th className="border border-gray-300 p-2">Kniha</th>
              <th className="border border-gray-300 p-2">Dátum plánovaného požičania</th>
              <th className="border border-gray-300 p-2">Dátum plánovaného vrátenia</th>
              <th className="border border-gray-300 p-2">Stav</th>
              <th className="border border-gray-300 p-2"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id} className="border border-gray-300 text-center">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{booking.user?.name || "neznámy používateľr"}</td>
                <td className="p-2">{books[booking.book] || "Načítava sa..."}</td>
                <td className="p-2">{new Date(booking.startDate).toLocaleDateString()}</td>
                <td className="p-2">{new Date(booking.endDate).toLocaleDateString()}</td>
                <td className="p-2">
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="čaká sa">čaká sa</option>
                    <option value="schválená">schválená</option>
                    <option value="zrušená">zrušená</option>
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => deleteBooking(booking._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Odstrániť
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowBooking;

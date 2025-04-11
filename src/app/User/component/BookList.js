"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import useFetchData from "@/app/hooks/useFetchData";
import { toast } from "react-toastify";

const BookingsList = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;


  const {
    data: userBookings,
    error,
    loading,
  } = useFetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/booking/user/${userId}`);


 const [bookData, setBookData] = useState({}); 
 const [bookLoading, setBookLoading] = useState(true);

 
 useEffect(() => {
    const fetchBookDetails = async () => {
      if (userBookings && userBookings.length > 0) {
        setBookLoading(true);
        const bookPromises = userBookings.map(async (booking) => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/book/${booking.book}`
            );
            const data = await response.json();
            return { bookingId: booking._id, title: data.title };
          } catch (error) {
            console.error("Chyba pri načítavaní údajov o knihe.:", error);
            return { bookingId: booking._id, title: "Názov nebol nájdený." };
          }
        });

        const bookResults = await Promise.all(bookPromises);
        const bookMap = bookResults.reduce((acc, book) => {
          acc[book.bookingId] = book.title;
          return acc;
        }, {});

        setBookData(bookMap);
        setBookLoading(false);
      }
    };

    fetchBookDetails();
  }, [userBookings]);


  const cancelBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/booking/${bookingId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Nepodarilo sa zrušiť rezerváciu");
      toast.success("Rezervácia úspešne zrušená");
      window.location.reload();
    } catch (error) {
      console.error("Error pri zrušení rezervácie:", error);
    }
  };


  if (loading || bookLoading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <p className="text-lg font-semibold text-gray-600">Rezervácie sa načítavajú...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {error ? (
        <p className="text-red-500">{error.message || "Neboli nájdené žiadne rezervácie."}</p>
      ) : !Array.isArray(userBookings) || userBookings.length === 0 ? (
        <p>Neboli nájdené žiadne rezervácie.</p>
      ) : (
        <div className="overflow-x-auto border rounded shadow-md bg-white p-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Názov knihy</th>
                <th className="border px-4 py-2 text-left">Dátum plánovaného požičania</th>
                <th className="border px-4 py-2 text-left">Dátum plánovaného vrátenia</th>
                <th className="border px-4 py-2 text-left">Stav</th>
                <th className="border px-4 py-2 text-left">Možnosti</th>
              </tr>
            </thead>
            <tbody>
              {userBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="border px-4 py-2">
                    {bookData[booking._id] || "No Title Found"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(booking.startDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 text-white rounded ${
                        booking.status === "schválená"
                          ? "bg-green-500"
                          : booking.status === "čaká sa"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    {booking.status === "čaká sa" && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Zrušiť
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsList;

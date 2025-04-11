"use client";
import { AuthContext } from "@/app/context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManageFines = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fineAmount, setFineAmount] = useState({});
  const [bookTitles, setBookTitles] = useState({});
  const { user } = useContext(AuthContext);
  const adminId = user?._id;

 
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/borrow-book`);
      if (!response.ok) throw new Error("nepodarilo sa načítať rezervácie");

      let data = await response.json();

  
      const bookPromises = data.map(async (borrowed) => {
        if (!borrowed.book) return { id: borrowed.book, title: "neznáma kniha" };
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/book/${borrowed.book}`);
          if (!res.ok) throw new Error();
          const bookData = await res.json();
          return { id: borrowed.book, title: bookData?.title || "neznáma kniha" };
        } catch {
          return { id: borrowed.book, title: "neznáma knihak" };
        }
      });

      const booksData = await Promise.all(bookPromises);
      const bookMap = booksData.reduce((acc, book) => {
        acc[book.id] = book.title;
        return acc;
      }, {});

      setBookTitles(bookMap);

   
      const userPromises = data.map(async (borrowed) => {
        if (borrowed.user) {
          try {
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${borrowed.user}`);
            if (userResponse.ok) {
              const userData = await userResponse.json();
              return { ...borrowed, userName: userData.data?.name || "neznámy používateľ" };
            }
          } catch (error) {
            console.error(`Error pri načítani používateľa ${borrowed.user}:`, error);
          }
        }
        return { ...borrowed, userName: "neznámy použivateľ" };
      });

      const bookingsWithUsers = await Promise.all(userPromises);
      setBookings(bookingsWithUsers);

 
      fetchFines();
    } catch (error) {
      console.error("Error pri načítani rezervácii:", error);
    }
    setLoading(false);
  };

  const fetchFines = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/fine`);
        if (!response.ok) throw new Error("nepodarilo sa načítať pokuty");

        const data = await response.json();


        console.log("Raw API Response:", data);

        if (!Array.isArray(data.fines)) {
            console.error("Error: Expected an array but got:", data.fines);
            return;
        }

   
        const fineAmounts = data.fines.map((fine, index) => {
            console.log(`Fine ${index + 1}:`, fine); 
            return fine.amount;
        });

        console.log("suma pokuty:", fineAmounts);


        const finesMap = data.fines.reduce((acc, fine) => {
            acc[fine.borrowBook?._id || fine._id] = fine.amount; 
            return acc;
        }, {});

        setFineAmount(finesMap);
    } catch (error) {
        console.error("Error pri načítani pokút:", error);
    }
};


  useEffect(() => {
    fetchBookings();
  }, []);

 
  const imposeFine = async (borrowBookId) => {
    try {
      const amount = fineAmount[borrowBookId] || 0;
      if (amount <= 0) {
        toast.error("Hodnota pokuty musí byť väčšia ako 0");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/fine/impose`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ borrowBookId, adminId, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Nepodarilo sa uložiť pokutu");
      }

      toast.success("úspešne uložená pokuta!");
      fetchBookings();
    } catch (error) {
      console.error("Error pri uložení pokuty:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-4">spravovať pokuty</h2>

      {loading ? (
        <p>Načítava sa...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">#</th>
              <th className="border border-gray-300 p-2">Meno</th>
              <th className="border border-gray-300 p-2">Kniha</th>
              <th className="border border-gray-300 p-2">Dátum plánovaného požičania</th>
              <th className="border border-gray-300 p-2">Dátum plánovaného vrátenia</th>
              <th className="border border-gray-300 p-2">Pokuta</th>
              <th className="border border-gray-300 p-2"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id} className="border border-gray-300">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{booking.userName || "neznámy"}</td>
                <td className="p-2">{bookTitles[booking.book] || "neznáma kniha"}</td>
                <td className="p-2">{new Date(booking.startDate).toLocaleDateString()}</td>
                <td className="p-2">{new Date(booking.endDate).toLocaleDateString()}</td>
                <td className="p-2">
                <td className="p-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={fineAmount[booking._id] || 0}
                      onChange={(e) =>
                        setFineAmount({ ...fineAmount, [booking._id]: e.target.value })
                      }
                      className="border p-1 rounded w-20 text-center pr-6"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                  </div>
                </td>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => imposeFine(booking._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Uložiť pokutu
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

export default ManageFines;

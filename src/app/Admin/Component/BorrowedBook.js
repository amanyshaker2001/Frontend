"use client";
import { AuthContext } from "@/app/context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { FaClock, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from "react-icons/fa";

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imposingFine, setImposingFine] = useState(false);
  const [editingFineId, setEditingFineId] = useState(null);
  const [fineAmount, setFineAmount] = useState({});
  const [bookTitles, setBookTitles] = useState({});
  const [usernames, setUsernames] = useState({});
  const {user}= useContext(AuthContext);
  const Admin = user?._id;

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/borrow-book`);
        if (!response.ok) throw new Error("Failed to fetch borrowed books");
        const data = await response.json();
        setBorrowedBooks(data);

        
        const bookPromises = data.map(async (borrowed) => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/book/${borrowed.book}`);
            if (!res.ok) throw new Error();
            const bookData = await res.json();
            return { id: borrowed.book, title: bookData?.title || "Unknown Book" };
          } catch {
            return { id: borrowed.book, title: "Unknown Book" };
          }
        });

        const booksData = await Promise.all(bookPromises);
        const bookMap = booksData.reduce((acc, book) => {
          acc[book.id] = book.title;
          return acc;
        }, {});

        setBookTitles(bookMap);


        const userPromises = data.map((borrowed) =>
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${borrowed.user}`)
            .then(async (res) => (res.ok ? res.json() : null))
            .catch(() => "Unknown User")
        );

        const usersData = await Promise.all(userPromises);
        const userMap = {};
        data.forEach((borrowed, index) => {
          userMap[borrowed.user] = usersData[index]?.data?.name || "Unknown User";
        });
        setUsernames(userMap);
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const handleImposeFine = async (id) => {
    if (!fineAmount[id]) {
      alert("Please enter a fine amount.");
      return;
    }

    setImposingFine(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/fine/impose`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowBookId: id, amount: fineAmount[id] }),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || "nepodarilo sa uložiť pokutu"); 
      }

      alert("pokuta úspešne uložená!");
      setEditingFineId(null);
      const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/borrow-book`);
      if (!updatedResponse.ok) throw new Error("Nepodarilo sa načítať aktualizované údaje.");
      setBorrowedBooks(await updatedResponse.json());
    } catch (error) {
      console.error("Error priuložení pokuty:", error);
      alert(error.message || "nepodarilo sa uložiť pokutu.");
    } finally {
      setImposingFine(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Načítava sa...</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Požičané knihy</h2>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Názov knihy</th>
            <th className="border p-2">Meno používateľa</th>
            <th className="border p-2">Dátum plánovaného požičania</th>
            <th className="border p-2">Dátum plánovaného vrátenia</th>
            <th className="border p-2">Stav</th>
            <th className="border p-2">Uloženie pokuty</th>
          </tr>
        </thead>
        <tbody>
          {borrowedBooks.map((book) => (
            <tr key={book._id} className="text-center">
              <td className="border p-2">{bookTitles[book.book] || "Unknown"}</td>
              <td className="border p-2">{usernames[book.user] || "Unknown"}</td>
              <td className="border p-2">{new Date(book.startDate).toLocaleDateString()}</td>
              <td className="border p-2">{new Date(book.endDate).toLocaleDateString()}</td>
              <td className="border p-2 flex items-center justify-center space-x-2">
                {book.isReturned ? (
                  <span className="text-green-500 flex items-center">
                    <FaCheckCircle className="mr-1" /> Vrátená
                  </span>
                ) : book.isLate ? (
                  <span className="text-red-500 flex items-center">
                    <FaClock className="mr-1" /> meškajúca
                  </span>
                ) : (
                  <span className="text-yellow-500 flex items-center">
                    <FaTimesCircle className="mr-1" /> Nevrátená
                  </span>
                )}
              </td>
              <td className="border p-2">
                {book.isLate && !book.isReturned && (
                  editingFineId === book._id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={fineAmount[book._id] || ""}
                        onChange={(e) =>
                          setFineAmount({
                            ...fineAmount,
                            [book._id]: e.target.value,
                          })
                        }
                        className="border p-1 rounded w-20 text-center"
                        placeholder="Pokuta"
                      />
                      <button
                        onClick={() => handleImposeFine(book._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        disabled={imposingFine}
                      >
                        {imposingFine ? "Ukladá sa." : "Uložiť"}
                      </button>
                      <button
                        onClick={() => setEditingFineId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Zrušiť
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingFineId(book._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded flex items-center"
                    >
                      <FaMoneyBillWave className="mr-1" /> Uložiť pokutu
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowedBooks;

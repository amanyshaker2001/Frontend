"use client";
import { AuthContext } from "@/app/context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock, FaUndo } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserBorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [bookTitles, setBookTitles] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingBookId, setProcessingBookId] = useState(null);
  const { user } = useContext(AuthContext);
  const userId = user?._id;

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        if (!userId) return;

      
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/borrow-book/${userId}`);
        if (!response.ok) throw new Error("Nepodarilo sa načítať požičané knihy.");
        const borrowedBooksData = await response.json();
        setBorrowedBooks(borrowedBooksData);

      
        const bookPromises = borrowedBooksData.map(async (borrowed) => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/book/${borrowed.book}`);
            if (!res.ok) throw new Error();
            const bookData = await res.json();
            return { id: borrowed.book, title: bookData?.title || "neznáma kniha" };
          } catch {
            return { id: borrowed.book, title: "neznáma kniha" };
          }
        });

        const booksData = await Promise.all(bookPromises);
        const bookMap = booksData.reduce((acc, book) => {
          acc[book.id] = book.title;
          return acc;
        }, {});

        setBookTitles(bookMap);
        setLoading(false);
      } catch (error) {
        console.error("Chyba pri načítavaní požičaných kníh:", error);
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, [userId]);

  const handleReturnBook = async (bookId) => {
    setProcessingBookId(bookId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/borrow-book/return/${bookId}`, {
        method: "POST",
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Nepodarilo sa vrátiť knihu");

      toast.success(responseData.message);
      setBorrowedBooks(borrowedBooks.map(book => 
        book._id === bookId ? { ...book, isReturned: true } : book
      ));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessingBookId(null);
    }
  };

  if (loading) return <p className="text-center text-gray-500"> Načítava sa...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Moje pôžičky</h2>
      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="border p-3">Názov knihy</th>
            <th className="border p-3">Dátum plánovaného požičania</th>
            <th className="border p-3">Dátum plánovaného vrátenia</th>
            <th className="border p-3">Stav</th>
            <th className="border p-3">Možnosti</th>
          </tr>
        </thead>
        <tbody>
          {borrowedBooks.map((book) => (
            <tr key={book._id} className="text-center hover:bg-gray-50 transition">
              <td className="border p-3">{bookTitles[book.book] || "Loading..."}</td>
              <td className="border p-3">{new Date(book.startDate).toLocaleDateString()}</td>
              <td className="border p-3">{new Date(book.endDate).toLocaleDateString()}</td>
              <td className="border p-3">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md 
                  ${book.isReturned ? "bg-green-100 text-green-600" :
                    book.isLate ? "bg-red-100 text-red-600" :
                    "bg-yellow-100 text-yellow-600"}`}>
                  {book.isReturned ? (
                    <><FaCheckCircle className="mr-1" /> Vrátená</>
                  ) : book.isLate ? (
                    <><FaClock className="mr-1" /> meškajúca</>
                  ) : (
                    <><FaTimesCircle className="mr-1" /> Nevrátená</>
                  )}
                </span>
              </td>
              <td className="border p-3">
                {!book.isReturned && (
                  <button
                    onClick={() => handleReturnBook(book._id)}
                    className="bg-blue-500 text-white px-3 py-1 text-xs rounded-md hover:bg-blue-600"
                    disabled={processingBookId === book._id}
                  >
                    {processingBookId === book._id ? "Processing..." : <><FaUndo className="mr-1" /> Vrátiť</>}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserBorrowedBooks;

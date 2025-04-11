"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader.js";

const Return = () => {
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [bookTitles, setBookTitles] = useState({});
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturnedBooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/borrow-book/return`);
        if (!res.ok) throw new Error("Nepodarilo sa načítať vrátené knihy.");
        
        const data = await res.json();
        setReturnedBooks(data);

      
        const bookPromises = data.map(async (borrowed) => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/book/${borrowed.book}`);
            if (!res.ok) throw new Error();
            const bookData = await res.json();
            return { id: borrowed.book, title: bookData?.title || "Neznáma kniha" };
          } catch {
            return { id: borrowed.book, title: "Neznáma kniha" };
          }
        });

        const booksData = await Promise.all(bookPromises);
        setBookTitles(booksData.reduce((acc, book) => ({ ...acc, [book.id]: book.title }), {}));

        const userPromises = data.map(async (borrowed) => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${borrowed.user}`);
            if (!res.ok) throw new Error();
            const userData = await res.json();
            return { id: borrowed.user, name: userData?.data?.name || "Neznámy používateľ" };
          } catch {
            return { id: borrowed.user, name: "Neznámy používateľ" };
          }
        });

        const usersData = await Promise.all(userPromises);
        setUsernames(usersData.reduce((acc, user) => ({ ...acc, [user.id]: user.name }), {}));
        
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReturnedBooks();
  }, []);

  return (
    <section className="px-5 lg:px-[200px] py-10">
      <div className="w-full max-w-5xl mx-auto rounded-lg shadow-md p-6 bg-white">
        <h3 className="text-headingColor text-[22px] font-bold mb-6 text-center">
          Vrátené knihy
        </h3>

        {loading ? (
          <div className="flex justify-center items-center">
            <HashLoader size={40} color="#0066ff" />
          </div>
        ) : returnedBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                  <th className="px-4 py-3 border">Názov knihy</th>
                  <th className="px-4 py-3 border">Meno používateľa</th>
                  <th className="px-4 py-3 border">Dátum plánovaného požičania</th>
                  <th className="px-4 py-3 border">Dátum plánovaného vrátenia</th>
                  <th className="px-4 py-3 border">Dátum vrátenia</th>
                  <th className="px-4 py-3 border">Stav</th>
                </tr>
              </thead>
              <tbody>
                {returnedBooks.map((book) => (
                  <tr key={book._id} className="text-sm border-b hover:bg-gray-50">
                    <td className="border p-2">{bookTitles[book.book] || "neznáma kniha"}</td>
                    <td className="border p-2">{usernames[book.user] || "neznámy použivateľ"}</td>
                    <td className="px-4 py-3 border">
                      {book.booking?.startDate
                        ? new Date(book.booking.startDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 border">
                      {book.booking?.endDate
                        ? new Date(book.booking.endDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 border">
                      {book.updatedAt
                        ? new Date(book.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 border text-green-600 font-bold">Vrátená</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-textColor">Neboli nájdené žiadne vrátené knihy.</p>
        )}
      </div>
    </section>
  );
};

export default Return;

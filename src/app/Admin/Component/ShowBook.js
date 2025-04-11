"use client"
import useFetchData from "@/app/hooks/useFetchData";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ShowBook = () => {
  const { data: fetchedBooks, error, loading } = useFetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/book`);
  const [books, setBooks] = useState([]); 
  const [deleting, setDeleting] = useState(null);
  const router = useRouter();

  
  useEffect(() => {
    if (fetchedBooks) {
      setBooks(fetchedBooks);
    }
  }, [fetchedBooks]);

  const handleEdit = (id) => {
    router.push(`/Edit-book/${id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Určite chcete túto knihu odstrániť?")) return;

    setDeleting(id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/book/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Nepodarilo sa odstrániť knihu");
      }

      toast.success("Kniha úspešne odstranená");
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));

    } catch (err) {
      console.error("Chyba pri odstraňovaní knihy.:", err.message);
      alert("Chyba pri odstraňovaní knihy.: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Načítavajú sa knihy...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Dostupné knihy</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books?.map((book) => (
          <div key={book.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition">
            <img src={book.images?.[0] || "/default-book.jpg"} alt={book.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{book.title}</h3>
              <p className="text-gray-600">Autor: {book.author || "neznámy"}</p>
              <p className="text-gray-500">rok vydania: {book.publicationYear || "N/A"}</p>
              <p className="text-gray-500">vydavateľstvo: {book.publisher || "neznámy"}</p>
            </div>
            <div className="p-4 flex justify-between items-center">
              <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition" onClick={() => handleEdit(book.id)}>Upraviť</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onClick={() => handleDelete(book.id)} disabled={deleting === book.id}>
                {deleting === book.id ? "Odstraňuje sa..." : "Odstrániť"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowBook;

"use client";
import { AuthContext } from "@/app/context/AuthContext";
import { useContext, useEffect, useState } from "react";

const FinePayment = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const [fineData, setFineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [paying, setPaying] = useState({});
  const [bookNames, setBookNames] = useState({}); 

  useEffect(() => {
    const fetchFine = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/fine/${userId}`);
        if (!response.ok) throw new Error("Nepodarilo sa načítať podrobnosti o pokute.");

        const data = await response.json();
        setFineData(Array.isArray(data.fines) ? data.fines : [data.fines]);
      } catch (error) {
        // console.error("Error pri načítani detaily pokuty:", error);
        // setMessage("Error pri načítani detaily pokuty.");
      } finally {
        setLoading(false);
      }
    };

    fetchFine();
  }, [userId]);

  useEffect(() => {
    const fetchBookNames = async () => {
      const newBookNames = {};

      await Promise.all(
        fineData.map(async (fine) => {
          if (fine.borrowBook?.book) {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/book/${fine.borrowBook.book}`
              );
              if (response.ok) {
                const bookData = await response.json();
                newBookNames[fine.borrowBook.book] = bookData.title;
              }
            } catch (error) {
              console.error("Chyba pri načítavaní podrobností o knihe:", error);
            }
          }
        })
      );

      setBookNames(newBookNames);
    };

    if (fineData.length > 0) {
      fetchBookNames();
    }
  }, [fineData]);

  const handlePayment = async (fineId) => {
    setPaying((prev) => ({ ...prev, [fineId]: true }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/fine/pay/${fineId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Platba zlyhala");

      setFineData((prev) =>
        prev.map((fine) =>
          fine._id === fineId ? { ...fine, isPaid: true, amount: 0 } : fine
        )
      );

      setMessage("Pokuta bola úspešne zaplatená!");
    } catch (error) {
      console.error("Chyba pri platbe pokuty.:", error);
      setMessage("Platba neprešla, skúste znovu.");
    } finally {
      setPaying((prev) => ({ ...prev, [fineId]: false }));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Platba pokuty</h2>
      {loading ? (
        <p>Pokuty sa načítavajú...</p>
      ) : fineData.length === 0 ? (
        <p>Neboli žiadné pokuty nájdené.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID knihy</th>
              <th className="border border-gray-300 px-4 py-2">Názov knihy</th>
              <th className="border border-gray-300 px-4 py-2">Suma</th>
              <th className="border border-gray-300 px-4 py-2">Stav</th>
              <th className="border border-gray-300 px-4 py-2">Možnosti</th>
            </tr>
          </thead>
          <tbody>
            {fineData.map((fine, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {fine.borrowBook?.book || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {bookNames[fine.borrowBook?.book] || "Fetching..."}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-red-500">
                  €{fine.amount ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {fine.isPaid ? (
                    <span className="text-green-600">Zaplatená ✅</span>
                  ) : (
                    <span className="text-red-500">čaká sa ❌</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {!fine.isPaid && (
                    <button
                      onClick={() => handlePayment(fine._id)}
                      className={`px-4 py-2 rounded-lg ${
                        fine.amount === 0
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white"
                      } disabled:opacity-50`}
                      disabled={paying[fine._id] || fine.amount === 0}
                    >
                      {paying[fine._id] ? "Processing..." : "Uhradiť pokutu"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default FinePayment;

"use client";
import { AuthContext } from "@/app/context/AuthContext";
import useFetchData from "@/app/hooks/useFetchData";
import { useState, useContext } from "react";
import { toast } from "react-toastify";

const SidePanel = ({ availability, bookId }) => {
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { user } = useContext(AuthContext);

  const userid = user?._id;
  const email = user?.email;
  const name = user?.name;
  console.log("userid", userid);

  console.log("bookId",bookId)

  const { data: fetchedBooks, error, loading } = useFetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/book/${bookId}`);
  console.log("fetchedBook", fetchedBooks);

  const adminId = fetchedBooks?.adminId;
  console.log("adminid", adminId);

  const handleRequestBooking = () => {
    if (!user) {
      toast.error("Musíte sa prihlásiť.");
      return;
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!name || !email || !startDate || !endDate) {
      toast.error("Prosím, vyplňte všetky polia.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Dátum ukončenia nemôže byť pred dátumom začiatku.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userid, 
          admin: adminId,
          book: bookId,
          name,
          email,
          startDate,
          endDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Rezervačný formulár bol úspešne odoslaný!");
        setShowModal(false);
        setStartDate("");
        setEndDate("");
      } else {
        toast.error(data.message || "Nastala chyba pri odosielaní rezervácie.");
      }
    } catch (error) {
      toast.error("Niečo sa pokazilo. Skúste to prosím znova..");
      console.error("Chyba pri požiadavke na rezerváciu.:", error);
    }
  };

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="mt-[30px]">
        <p className="text_para mt-0 font-semibold text-headingColor">
          Dostupnosť
        </p>
        <ul className="mt-3">
          {Array.isArray(availability) && availability.length > 0 ? (
            availability.map((date, index) => (
              <li key={index} className="text-[15px] leading-6 text-textColor font-semibold">
                {date}
              </li>
            ))
          ) : (
            <p className="text-red-500 text-xl font-bold">{availability}</p>
          )}
        </ul>
      </div>

  
      <button
        onClick={handleRequestBooking}
        className="btn px-2 w-full rounded-md"
      >
        Rezervovať
      </button>

     
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-semibold mb-4">Rezervovať</h2>

          
            <label className="block text-sm font-medium">Dátum plánovaného požičania</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-md p-2 mb-3"
            />

            
            <label className="block text-sm font-medium">Dátum plánovaného vrátenia</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-md p-2 mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded-md"
              >
                Zrušiť
              </button>
              <button onClick={handleSubmit} className="px-3 py-1 bg-blue-500 text-white rounded-md">
                Rezervovať
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel;

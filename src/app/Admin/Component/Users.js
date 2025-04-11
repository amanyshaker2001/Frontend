"use client"
import useFetchData from '@/app/hooks/useFetchData';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Users = () => {
  const { data: users, error, loading, setData } = useFetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/users`);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (userId) => {
    if (!confirm("Určite chcete odstrániť tohto používateľa?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Nepodarilo sa odstrániť používateľa');
      }

      toast.success("úspešne odstránený používateľ")
   
      setData((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Chyba pri odstraňovaní používateľa:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="text-center text-blue-600">Načítava sa...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">Zoznam používateľov</h1>
      {users.length > 0 ? (
        <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id} className="p-3 border rounded-lg shadow-sm flex justify-between items-center">
            <div>
              <p className="font-semibold">Meno: {user.name}</p>
              <p>Email: {user.email}</p>
            </div>
            <button
              onClick={() => handleDelete(user._id)}
              className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
              disabled={deleting}
            >
              {deleting ? "Odstraňuje sa..." : "Odstrániť"}
            </button>
          </li>
        ))}
      </ul>      
      ) : (
        <p className="text-center text-gray-500">Neexistujú žiadni používatelia.</p>
      )}
    </div>
  );
};

export default Users;

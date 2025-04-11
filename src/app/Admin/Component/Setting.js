"use client";
import { toast } from 'react-toastify';
import useFetchData from '../../hooks/useFetchData';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation'; 

const Setting = () => {
  const { dispatch } = useContext(AuthContext); 
  const router = useRouter(); 
  
  
  const user = JSON.parse(localStorage.getItem('user')); 
  const userId = user?._id;
  const userRole = localStorage.getItem('role'); 

 
  const { data: adminData, error } = useFetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/${userId}`);

  
  const [formData, setFormData] = useState({
    name: '', 
    gender: '',
    email: '',
    role: userRole || '', 
  });


  useEffect(() => {
    if (adminData) {
      setFormData({
        name: adminData.name || '', 
        gender: adminData.gender || '',
        email: adminData.email || '',
        role: userRole || '', 
      });
    }
  }, [adminData, userRole]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Údaje boli úspešne aktualizované.:', result);
        toast.success(result.message);
      } else {
        console.error('Nepodarilo sa aktualizovať údaje.');
      }
    } catch (error) {
      console.error('Chyba pri aktualizácii údajov.:', error);
    }
  };

  
  const handleDelete = async () => {
    const confirmation = window.confirm('Naozaj si prajete odstrániť údaje tohto administrátora?');
    if (!confirmation) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Údaje boli úspešne odstránené.:', result);
        toast.success(result.message);

        
        dispatch({ type: 'LOGOUT' });

       
        router.push('/'); 
      } else {
        console.error('Nepodarilo sa odstrániť údaje.');
        toast.error('Nepodarilo sa odstrániť údaje administrátora.');
      }
    } catch (error) {
      console.error('Chyba pri odstraňovaní údajov.:', error);
      toast.error('Chyba pri odstraňovaní údajov administrátora.');
    }
  };

  
  if (error) return <p>Chyba pri načítavaní údajov.</p>;
  if (!adminData) return <p>Načítava sa..</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Nastavenia účtu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Prihlasovacie meno</label>
          <input
            type="text"
            id="name"
            name="name" 
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md mt-1"
            placeholder="Enter Name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="gender" className="block text-gray-700">Pohlavie</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md mt-1"
            required
          >
            <option value="">Pohlavie</option>
            <option value="male">muž</option>
            <option value="female">žena</option>
            
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md mt-1"
            placeholder="Enter email"
            disabled
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700">Rola</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md mt-1"
            placeholder="Role"
            disabled
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
        >
          Uložiť nastavenia
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="w-full bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-600"
      >
        Odstrániť účet
      </button>
    </div>
  );
};

export default Setting;

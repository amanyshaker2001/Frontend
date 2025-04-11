"use client"
import React, { useState, useEffect } from 'react';
import { BiPlus } from 'react-icons/bi';
import { FaBook, FaUsers, FaCog } from 'react-icons/fa';
import { RiBookFill, RiSecurePaymentFill } from 'react-icons/ri';
import AddBook from './Component/AddBook';
import Setting from './Component/Setting';
import ShowBook from './Component/ShowBook';
import Users from './Component/Users';
import ShowBooking from './Component/ShowBooking';
import ManageFines from './Component/ManageFines';
import BorrowedBooks from './Component/BorrowedBook';
import Return from './Component/Return';

const Page = () => {
  const [activeTab, setActiveTab] = useState('books');

  return (
    <div className="w-full flex flex-col items-center p-4 bg-white shadow-md">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center p-2 rounded-lg ${activeTab === 'books' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaBook className="mr-2" /> Knihy
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center p-2 rounded-lg ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaUsers className="mr-2" /> Použivatelia
        </button>
        <button
          onClick={() => setActiveTab('AddBook')}
          className={`flex items-center p-2 rounded-lg ${activeTab === 'AddBook' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <BiPlus className="mr-2" /> Pridať knihu
        </button>
        <button
          onClick={() => setActiveTab('booking')}
          className={`flex items-center p-2 rounded-lg ${activeTab === 'booking' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <RiBookFill className="mr-2" /> Zoznam rezervácií
        </button>
        <button
          onClick={() => setActiveTab('fine')}
          className={`flex items-center p-2 rounded-lg ${activeTab === 'fine' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <RiSecurePaymentFill className="mr-2" /> Pokuty
        </button>
        <button
          onClick={() => setActiveTab('borrowed')}
          className={`flex items-center p-2 rounded-lg ${activeTab === 'borrowed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <RiBookFill className="mr-2" /> Pôžičky
        </button>
        <button
          onClick={() => setActiveTab('return')}
          className={`flex items-center p-2 rounded-lg ${activeTab === 'return' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <RiBookFill className="mr-2" /> Vratené knihy
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center p-2 rounded-lg ${activeTab === 'settings' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaCog className="mr-2" /> Nastavenia
        </button>
      </div>
      <div className="w-full p-4 border rounded-lg bg-gray-50">
        {activeTab === 'books' && <ShowBook/>}
        {activeTab === 'users' && <Users/>}
        {activeTab === 'settings' && <Setting/>}
        {activeTab === 'AddBook' && <AddBook />}
        {activeTab === 'booking' && <ShowBooking />}
        {activeTab === 'fine' && <ManageFines />}
        {activeTab === 'borrowed' && <BorrowedBooks />}
        {activeTab === 'return' && <Return />}
      </div>
    </div>
  );
};

export default Page;

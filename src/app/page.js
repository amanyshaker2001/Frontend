import React from 'react';
import { FaBookOpen, FaUsers, FaCalendarCheck, FaInfoCircle } from 'react-icons/fa';
import BookCard from './Component/BookCard';
import Link from "next/link";


export default function Home() {
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Vitajte v našom knižničnom systéme</h1>
        <p className="text-lg mb-6">Vstupná brána k vedomostiam, zdrojom a inováciám</p>
        <Link href="/Search">
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition">
          Pozrieť si ponuku
       </button>
        </Link>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-4">O nás</h2>
        <p className="text-gray-600 max-w-xl mx-auto">Vitajte v našej  knižnici – priestore, kde sa spája láska ku knihám s modernými technológiami. Ponúkame jednoduchý a rýchly prístup k širokej ponuke kníh, ktoré si môžete pohodlne rezervovať online. Naším cieľom je sprístupniť čítanie každému, kdekoľvek a kedykoľvek. Objavte svet vedomostí a príbehov s nami – požičiavanie kníh nebolo nikdy jednoduchšie!</p>
      </section>

      {/* <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
        <FaBookOpen className="text-blue-600 text-6xl mb-5 transition-transform group-hover:rotate-12" />
        <h3 className="text-2xl font-bold mb-3 text-gray-800">Vast Collection</h3>
        <p className="text-gray-600 text-lg leading-relaxed">Explore thousands of books and digital resources at your fingertips.</p>
      </div>
      <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
        <FaUsers className="text-purple-600 text-6xl mb-5 transition-transform group-hover:rotate-12" />
        <h3 className="text-2xl font-bold mb-3 text-gray-800">Community</h3>
        <p className="text-gray-600 text-lg leading-relaxed">Join a community of learners, researchers, and book enthusiasts.</p>
      </div>
      <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
        <FaCalendarCheck className="text-green-600 text-6xl mb-5 transition-transform group-hover:rotate-12" />
        <h3 className="text-2xl font-bold mb-3 text-gray-800">Events & Workshops</h3>
        <p className="text-gray-600 text-lg leading-relaxed">Participate in seminars, workshops, and book discussions.</p>
      </div>
    </section> */}

    <BookCard/>
    </div>
  );
}

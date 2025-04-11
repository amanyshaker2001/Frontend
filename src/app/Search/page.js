'use client';

import React, { useState } from 'react';
import useFetchData from '@/app/hooks/useFetchData';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const Page = () => {
  const [query, setQuery] = useState("");
  const { data: booksData, loading, error } = useFetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/book`);

 
  const filteredBooks = booksData?.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>

      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          <h2 className="heading">Vyhľadať</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
            <input
              type="search"
              className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder="Názov alebo meno autora"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

    
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6">Objavte naše knihy</h2>

        {loading && <p className="text-gray-600">Načítavajú sa knihy...</p>}
        {error && <p className="text-red-600">Nepodarilo sa načítať knihy.</p>}
        {!loading && !error && filteredBooks?.length === 0 && (
          <p className="text-gray-500">Neboli nájdené žiadne knihy.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredBooks?.map((book, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col justify-between">
              <div>
                <img 
                  src={book.images?.[0]} 
                  alt={book.title} 
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800">{book.title}</h3>
                <p className="text-gray-600">Autor: {book.author}</p>
                <p className="text-gray-500 text-sm">Rok publikácie: {book.publicationYear}</p>
              </div>
              <div className="mt-4 text-right">
                <Link href={`/books/${book.id}`} 
                  className='w-[44px] rounded-full border border-solid border-[#181A1E]
                  mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor
                  hover:border-none'>
                  <FaArrowRight className="group-hover:text-white w-6 h-5"/>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Page;

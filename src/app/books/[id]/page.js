"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SidePanel from '../component/SidePanel';
import Feedback from '../component/Feedback';

const BookDetailsPage = () => {
    const { id: bookId } = useParams();

    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [totalRating, setTotalRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/book/${bookId}`);
                if (!response.ok) throw new Error("Nepodarilo sa načítať podrobnosti o knihe.");

                const data = await response.json();
                setBook(data);

                const reviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/review/${bookId}`);
                if (!reviewsResponse.ok) throw new Error("Nepodarilo sa načítať recenzie.");

                const reviewsData = await reviewsResponse.json();
                setReviews(reviewsData);

                const avgRating = reviewsData.length 
                    ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length).toFixed(1)
                    : 0;
                
                setTotalRating(avgRating);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (bookId) {
            fetchBookDetails();
        }
    }, [bookId]);

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % book.images.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + book.images.length) % book.images.length);
    };

    return (
        <section>
            <div className="max-w-[1170px] px-5 mx-auto">
                {loading && <p className="text-gray-600">Načítavajú sa podrobnosti o knihe...</p>}
                {error && <p className="text-red-600">Nepodarilo sa načítať podrobnosti o knihe.</p>}

                {!loading && !error && book && (
                    <div className="grid md:grid-cols-3 gap-[50px]">
                        
                        <div className="md:col-span-2">
                            <div className="flex flex-col gap-5">
                               
                                {book.images?.length > 0 && (
                                    <div 
                                        className="relative flex justify-center"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                        <img
                                            src={book.images[currentImageIndex]} 
                                            alt="Book Image" 
                                            className="w-full h-[300px] object-cover rounded-md"
                                        />
                                        
                                        
                                        {isHovered && book.images.length > 1 && (
                                            <>
                                               
                                                <button 
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-full opacity-75 hover:opacity-100"
                                                    onClick={handlePrevImage}
                                                >
                                                    &#10094;
                                                </button>

                                               
                                                <button 
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-full opacity-75 hover:opacity-100"
                                                    onClick={handleNextImage}
                                                >
                                                    &#10095;
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold">
                                        {book.title}
                                    </h3>
                                    <p className="text-gray-600">Autor: {book.author}</p>
                                    <p className="text-gray-500 text-sm">Rok publikácie: {book.publicationYear}</p>
                                    <p className="text_para text-[14px] leading-6 md:text-[15px] lg:max-[390px]">
                                        {book.isbn}
                                    </p>
                                    <p className="text_para text-[14px] leading-6 md:text-[15px] lg:max-[390px]">
                                        {book.publisher}
                                    </p>
                                </div>
                            </div>
                        </div>

                        
                        <div>
                            <SidePanel 
                                availability={book.availability} 
                                bookId={bookId}
                            />
                        </div>
                    </div>
                )}

                
                {!loading && !error && (
                    <div className="mt-10">
                        <Feedback reviews={reviews} totalRating={totalRating} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default BookDetailsPage;

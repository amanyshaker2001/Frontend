"use client";
import uploadImageToCloudinary from '@/utils/uploadCloudinary';
import useFetchData from '../../hooks/useFetchData';
import React, { useContext, useState } from 'react';
import { FaBook, FaUser, FaBarcode, FaBuilding, FaCalendar, FaImage, FaClipboardCheck, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '@/app/context/AuthContext';

const AddBook = () => {
  const { user } = useContext(AuthContext);
  const adminId = user?._id;
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publicationYear: '',
    images: [],
    availability: 'Dostupné',
    adminId,
  });

  const [imagePreviews, setImagePreviews] = useState([]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
   
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);

    
    const uploadedImages = await Promise.all(files.map(file => uploadImageToCloudinary(file)));
    setBookData({ ...bookData, images: [...bookData.images, ...uploadedImages.map(img => img.url)] });
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);

    const newImages = [...bookData.images];
    newImages.splice(index, 1);

    setImagePreviews(newPreviews);
    setBookData({ ...bookData, images: newImages });
  };

  const handleAddBook = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Nepodarilo sa pridať knihu");
      }
  
      console.log('Kniha úspešne pridaná:', data);
      toast.success("Kniha úspešne pridaná");
    } catch (error) {
      console.error('Nepodarilo sa pridať knihu:', error);
      toast.error("Nepodarilo sa pridať knihu");
    }
  };
  

  return (
    <div className="p-8 max-w-xl mx-auto bg-gradient-to-br from-gray-100 to-white rounded-2xl shadow-lg space-y-6">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-4">Pridať novú knihu</h1>

      <div className="space-y-4">
        <div className="flex items-center bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition">
          <FaBook className="text-blue-600 mr-3 text-lg" />
          <input className="w-full p-2 border-none focus:ring-2 focus:ring-blue-400 rounded-lg" placeholder="Zadajte názov knihy" name="title" onChange={handleChange}/>
        </div>

        <div className="flex items-center bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition">
          <FaUser className="text-blue-600 mr-3 text-lg" />
          <input className="w-full p-2 border-none focus:ring-2 focus:ring-blue-400 rounded-lg" placeholder="Zadajte meno autora" name="author" onChange={handleChange}/>
        </div>

        <div className="flex items-center bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition">
          <FaBarcode className="text-blue-600 mr-3 text-lg" />
          <input className="w-full p-2 border-none focus:ring-2 focus:ring-blue-400 rounded-lg" placeholder="Zadajte ISBN" name="isbn" onChange={handleChange} />
        </div>

        <div className="flex items-center bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition">
          <FaBuilding className="text-blue-600 mr-3 text-lg" />
          <input className="w-full p-2 border-none focus:ring-2 focus:ring-blue-400 rounded-lg" placeholder="Zadajte názov publikácie" name="publisher" onChange={handleChange} />
        </div>

        <div className="flex items-center bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition">
          <FaCalendar className="text-blue-600 mr-3 text-lg" />
          <input className="w-full p-2 border-none focus:ring-2 focus:ring-blue-400 rounded-lg" placeholder="Zadajte rok vydania"  name="publicationYear" onChange={handleChange} />
        </div>

       
        <div className="flex flex-col bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition">
          <div className="flex items-center">
            <FaImage className="text-blue-600 mr-3 text-lg" />
            <input className="w-full p-2 border-none" type="file" multiple onChange={handleImageUpload} />
          </div>

         
          <div className="flex flex-wrap mt-3 gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-20 h-20">
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-md" />
                <button 
                  onClick={() => removeImage(index)} 
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                >
                  <FaTimesCircle />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="flex items-center bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition">
          <FaClipboardCheck className="text-blue-600 mr-3 text-lg" />
          <select className="w-full p-2 border-none bg-transparent focus:ring-2 focus:ring-blue-400 rounded-lg" name="availability" value={bookData.availability} onChange={handleChange}>
            <option value="Dostupné">Dostupné</option>
            <option value="nedostupné">nedostupné</option>

          </select>
        </div> */}
      </div>

      <button onClick={handleAddBook} className="w-full bg-blue-600 text-white py-3 px-5 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-md">
        Pridať knihu
      </button>
    </div>
  );
};

export default AddBook;

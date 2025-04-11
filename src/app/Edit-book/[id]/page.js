"use client";
import uploadImageToCloudinary from '@/utils/uploadCloudinary';
import { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaBook, FaUser, FaBarcode, FaBuilding, FaCalendar, FaImage, FaClipboardCheck, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { AuthContext } from '@/app/context/AuthContext';

const page = () => {
const router = useRouter();
const params = useParams();
const bookId = params.id;
const { user } = useContext(AuthContext);
const adminId = user?._id
console.log("Book id", bookId)
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publicationYear: '',
    images: [],
    availability: 'Dostupné',
    adminId
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/book/${bookId}`);
        const data = await response.json();
        if (response.ok) {
          setBookData(data);
          setImagePreviews(data.images);
        } else {
          throw new Error(data.message || 'Nepodarilo sa načítať podrobnosti o knihe.');
        }
      } catch (error) {
        console.error('Chyba pri načítavaní knihy:', error);
        toast.error('Nepodarilo sa načítať podrobnosti o knihe.');
      }
    };
    if (bookId) fetchBook();
  }, [bookId]);

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

  const handleEditBook = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/book/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Nepodarilo sa aktualizovať knihu.');
      }
      toast.success('Kniha úspešne aktualizovaná');
      router.push('/Admin');
    } catch (error) {
      console.error('Chyba pri aktualizácii knihy:', error);
      toast.error('Nepodarilo sa aktualizovať knihu.');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-gradient-to-br from-gray-100 to-white rounded-2xl shadow-lg space-y-6">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-4">Upraviť knihu</h1>
      <div className="space-y-4">
        <div className="flex items-center bg-white border rounded-lg p-3 shadow-sm">
          <FaBook className="text-blue-600 mr-3 text-lg" />
          <input className="w-full p-2 border-none" value={bookData.title} name="title" onChange={handleChange} />
        </div>
        <div className="flex items-center bg-white border rounded-lg p-3 shadow-sm">
          <FaUser className="text-blue-600 mr-3 text-lg" />
          <input className="w-full p-2 border-none" value={bookData.author} name="author" onChange={handleChange} />
        </div>
        <div className="flex items-center bg-white border rounded-lg p-3 shadow-sm">
          <FaBarcode className="text-blue-600 mr-3 text-lg" />
          <input className="w-full p-2 border-none" value={bookData.isbn} name="isbn" onChange={handleChange} />
        </div>
        <div className="flex items-center bg-white border rounded-lg p-3 shadow-sm">
          <FaBuilding className="text-blue-600 mr-3 text-lg" />
          <input className="w-full p-2 border-none" value={bookData.publisher} name="publisher" onChange={handleChange} />
        </div>
        <div className="flex items-center bg-white border rounded-lg p-3 shadow-sm">
          <FaCalendar className="text-blue-600 mr-3 text-lg" />
          <input className="w-full p-2 border-none" value={bookData.publicationYear} name="publicationYear" onChange={handleChange} />
        </div>
        <div className="flex flex-col bg-white border rounded-lg p-3 shadow-sm">
          <FaImage className="text-blue-600 mr-3 text-lg" />
          <input type="file" multiple onChange={handleImageUpload} />
          <div className="flex flex-wrap mt-3 gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-20 h-20">
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                <button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs">
                  <FaTimesCircle />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center bg-white border rounded-lg p-3 shadow-sm">
          <FaClipboardCheck className="text-blue-600 mr-3 text-lg" />
          <select className="w-full p-2 border-none" name="availability" value={bookData.availability} onChange={handleChange}>
            <option value="Dostupné">Dostupné</option>
            <option value="nedostupné">nedostupné</option>
          </select>
        </div>
      </div>
      <button onClick={handleEditBook} className="w-full bg-blue-600 text-white py-3 px-5 rounded-lg font-semibold">
        aktualizovať
      </button>
    </div>
  );
};

export default page;

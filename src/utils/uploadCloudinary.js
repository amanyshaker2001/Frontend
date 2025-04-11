"use client";

const upload_preset = "lmslmss"
const cloud_name = "dakyzu0bl"

const uploadImageToCloudinary = async (file) => {
  const uploadData = new FormData();

  uploadData.append('file', file);
  uploadData.append('upload_preset', upload_preset);
  uploadData.append('cloud_name', cloud_name);

  console.log('Upload Preset:', upload_preset);
  console.log('Cloud Name:', cloud_name);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
      method: 'POST',
      body: uploadData,
    });

    if (!res.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export default uploadImageToCloudinary;

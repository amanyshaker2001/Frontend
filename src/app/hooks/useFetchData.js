"use client";
import { useContext, useEffect, useState } from "react";

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  console.log("Fetching URL:", url);
  // console.log("Token:", token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Starting data fetch...");

        const res = await fetch(url, {
          // headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
  
          const errorResponse = await res.json();
          // console.error("API Error:", errorResponse);
          throw new Error(`${res.status}: ${res.statusText}`);
        }

        const result = await res.json();
        console.log("API Response:", result);

       
        if (result.data) {
          setData(result.data);
        } else {
          console.warn("Unexpected API structure:", result);
          setData(result); 
        }

        setLoading(false);
      } catch (err) {
        console.log("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (url != null) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error };
};

export default useFetchData;

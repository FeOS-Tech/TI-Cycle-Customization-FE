import { useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import banner from "../assets/banner/banner1.jpg";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
     document.title = `Track and Trail Studio`;
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const data = {
      sid: params.get("cid"),
      name: params.get("name"),
      phone: params.get("phone"),
      email: params.get("email"),
    };

    // quick sanity check
    console.log(data)
    if (!data.cid && !data.phone) return;

    sessionStorage.setItem("userData", JSON.stringify(data));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get("data");
    if (!encodedData) {
      console.log('No data found');
      return;
    }
    try {
      // Decode from Base64
      const data = JSON.parse(atob(encodedData));
      console.log('Decoded data:', data);
      if (!data.phone) {
        console.log('Missing required fields');
        return;
      }
      sessionStorage.setItem("userData", JSON.stringify(data));
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('Error decoding data:', error);
    }
  }, []);

  return (
    <section className='relative w-full overflow-hidden'
      style={{
        height: "100dvh",
        backgroundImage: `url('${banner}')`,
        backgroundSize: "100%",
        backgroundRepeat:" no-repeat"
      }}>
      <div className='absolute bottom-25 w-full px-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto'>
          <button
            onClick={() => navigate('/kids')}
            className='group w-full rounded-2xl px-6 py-5 text-center
           bg-white/75 backdrop-blur-md
           shadow-[0_10px_30px_rgba(0,0,0,0.2)]
           border border-white/40
           hover:bg-white/90
           hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]
           transition-all duration-300'
          >
            <h2 className='font-bold'>KIDS</h2>
            <p className='text-sm text-gray-500'>(Ages 3–8)</p>
          </button>

          <button
            onClick={() => navigate('/mtb')}
            className='group w-full rounded-2xl px-6 py-5 text-center
           bg-white/75 backdrop-blur-md
           shadow-[0_10px_30px_rgba(0,0,0,0.2)]
           border border-white/40
           hover:bg-white/90
           hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]
           transition-all duration-300'
          >
            <h2 className='font-bold'>MTB</h2>
            <p className='text-sm text-gray-500'>(Ages 8+)</p>
          </button>

          <button
            onClick={() => navigate('/inspired')}
            className='group w-full rounded-2xl px-6 py-5 text-center bg-white/75 backdrop-blur-md
           shadow-[0_10px_30px_rgba(0,0,0,0.2)]
           border border-white/40
           hover:bg-white/90
           hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]
           transition-all duration-300'
          >
            <h2 className='font-bold'>Get Inspired</h2>
            <p className='text-sm text-gray-500'>Explore designs</p>
          </button>
        </div>
      </div>
    </section>
  );
}

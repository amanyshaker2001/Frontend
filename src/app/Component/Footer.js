import React from 'react'
import Link from 'next/link';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className='py-6'> {/* zmenené z pb-16 na py-6 */}
      <div className='container mx-auto text-center'>
      <p className='text-[16px] leading-7 font-bold text-textColor'>
          Programový systém pre správu knižnice</p>
        <p className='text-[16px] leading-7 font-[400] text-textColor'>
          Vypracovala: Bc. Amany Shakerová IM02</p>
          <p className='text-[16px] leading-7 font-[400] text-textColor'>
          Vedúci  práce: 	Ing. Igor Bandurič, PhD. </p>
      </div>
    </footer>
  );
}

export default Footer;

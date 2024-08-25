import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav
      className="text-white py-5 font-PPMondwest text-xl bg-[#006d77]"
      style={{ fontFamily: "PPMondwest-Regular" }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-end">
          <Link href="/" className="px-3 py-2 rounded-md font-medium hover:underline">home</Link>
          <Link href="https://www.bnbchain.org/en/testnet-faucet" target="_blank"
            className="px-3 py-2 rounded-md font-medium hover:underline">BNB Faucet </Link>
          <Link href="https://docs-turquoise.vercel.app/" target='_blank'
            className="px-3 py-2 rounded-md font-medium hover:underline">about</Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
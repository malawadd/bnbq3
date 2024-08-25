import React from 'react';
import Link from 'next/link';
import {FONT} from "@/fonts/fonts";

export const Navbar = () => {
  return (
    <nav className={"text-white my-5 text-xl w-full " + FONT.className}>
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
"use client"

import {FONT} from "@/fonts/fonts";
import {useWeb3Modal, useWeb3ModalAccount} from '@web3modal/ethers/react'
import {Authenticated} from "@/components/authenticated/Authenticated";
import Navbar from "@/components/navbar";
import {BuildWithFayruz} from "@/components/buildwithfayruz";
import Addresses from "@/components/Addresses";


export function Landing() {
  const {open} = useWeb3Modal()

  const {address} = useWeb3ModalAccount()


  return (
    <main className="flex min-h-screen flex-col items-center gap-20 p-2 lg:p-12 justify-between z-2 relative bg-[#006d77]">
      <Navbar/>

      {!address ?
        <div
          className={"flex flex-col gap-6 text-center text-xl pb-40 " }
        >
          <div className="text-2xl lg:text-6xl">
            Text-to-image on chain 
          </div>
         
          <div className="pt-[100px]">
            <button
              onClick={() => open()}
              className={"p-4 bg-[#f9b043] text-3xl text-black hover:bg-[#cf9133] duration-200 " + FONT.className}
            >
              Connect wallet to Mint
            </button>
          </div>
          
        </div>
        :
        <Authenticated/>
      }


      <div
        className={"flex w-full flex-col lg:flex-row lg:justify-between items-end text-xl p-4 lg:p-0 bg-[#006d77]"}>
        <Addresses/>
        <BuildWithFayruz/>
      </div>
    </main>
  )
}

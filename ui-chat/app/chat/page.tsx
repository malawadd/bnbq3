'use client'
import { Suspense } from 'react'
import { Flex } from '@radix-ui/themes'
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { Chat, ChatContext, ChatSideBar, useChatHook } from '@/components'
import Addresses from "@/components/addresses";
import { BuildWithFayruz } from "@/components/buildwithfayruz";
import Navbar from "@/components/navbar";

const ChatProvider = () => {
  const provider = useChatHook()
  const { open } = useWeb3Modal()

  const { isConnected } = useWeb3ModalAccount()
  return (
    <ChatContext.Provider value={provider}>
      {isConnected ?
        <Flex style={{ height: 'calc(100% - 56px)', backgroundColor: "var(--background-color)" }} className="relative">
          <>
            <ChatSideBar />
            <div className="flex-1 relative">
              <Chat ref={provider.chatRef} />
            </div>
          </>
        </Flex>
        :
        <>
          <Navbar />
          <main
            className="flex min-h-screen flex-col items-center gap-20 p-2 lg:p-12 justify-between z-2 relative bg-[#006d77]">
            <div
              className={"flex flex-col gap-6 text-center text-xl"}
              
            >
              <div className="text-6xl">
                <div>
                  On-chain ChatGPT 
                </div>
              </div>
              <div className="pt-[100px]">
                <button
                  onClick={() => open()}
                  // className={"p-4 bg-[#00FF66] text-3xl text-black hover:bg-[#00b548] duration-200 " + FONT.className}
                  className={"p-4 bg-[#f9b043] text-3xl text-black hover:bg-[#cf9133] duration-200"}
                >
                  Connect wallet to Chat
                </button>

              </div>
              <div className="text-4xl pt-12">
                created for  <a href="https://dorahacks.io/hackathon/bnbchain-2024q2-onebnb/detail" target="_blank"
                  className="px-2 underline">OneBNB - Coding the Future Hackathon </a>
              </div>
            </div>
            <div
              className={"flex w-full flex-col lg:flex-row lg:justify-between items-end text-xl p-4 lg:p-0"}>
              <Addresses />
              <BuildWithFayruz />
            </div>
          </main>
        </>
      }
    </ChatContext.Provider>
  )
}

const ChatPage = () => {
  return (
    <Suspense>
      <ChatProvider />
    </Suspense>
  )
}

export default ChatPage

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ModalAddDappInput } from "./_components/ModalAddDappInput";
import { ModalIframe } from "./_components/ModalIframe";
import { ModalNewDappInput } from "./_components/ModalNewDappInput";
import { useImpersonatorIframe } from "@impersonator/iframe";
import type { NextPage } from "next";
import { useDebounceValue, useReadLocalStorage } from "usehooks-ts";
import { useAccount } from "wagmi";
import { TokenCounter } from "~~/app/_components/TokenCounter";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { isValidUrl } from "~~/utils/isValidUrl";
import { getTargetNetworks, notification } from "~~/utils/scaffold-eth";

const targetNetworks = getTargetNetworks();

const Home: NextPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newDappModalIsOpen, setNewDappModalIsOpen] = useState(false);
  const [addDappModalIsOpen, setAddDappModalIsOpen] = useState(false);
  const [selectedNetwork] = useState(targetNetworks[0]);
  const [appUrl, setAppUrl] = useState("");
  const [debounceAppUrl] = useDebounceValue(appUrl, 500);
  const customDapps = useReadLocalStorage<{ name: string; url: string }[]>("custom-dapps", {
    initializeWithValue: false,
  });

  const { address: connectedAddress } = useAccount();

  const writeTxn = useTransactor();

  const { latestTransaction, onUserTxConfirm, onTxReject } = useImpersonatorIframe();

  useEffect(() => {
    const makeTransaciton = async () => {
      try {
        if (!connectedAddress || !latestTransaction?.id) return;
        const txHash = await writeTxn({
          // @ts-expect-error
          to: latestTransaction.to,
          // @ts-expect-error
          value: latestTransaction.value,
          // @ts-expect-error
          data: latestTransaction.data,
          chain: targetNetworks[0],
          account: connectedAddress,
        });
        if (!txHash) return;
        onUserTxConfirm(txHash, latestTransaction?.id);
        console.log("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ test", txHash);
      } catch (e: any) {
        console.error("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ error", e);
        onTxReject(latestTransaction?.id);
      }
    };
    makeTransaciton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedAddress, latestTransaction?.id]);

  const handleIconDoubleClick = (url: string) => {
    if (!connectedAddress) return notification.error("Please connect your wallet");
    setAppUrl(url);
    setModalIsOpen(true);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-col gap-8 max-h-[60vh] flex-wrap">
          <div>
            <Image
              src="/assets/pancake.png"
              className="cursor-pointer"
              alt="bridge"
              width={100}
              height={100}
              onDoubleClick={() => handleIconDoubleClick("https://fayruz-chat.vercel.app/chat")}
            />
          </div>

          <div>
            <Image
              src="/assets/aave.png"
              className="cursor-pointer"
              alt="aave"
              width={100}
              height={100}
              onDoubleClick={() => handleIconDoubleClick("https://fayruz-nft.vercel.app/")}
            />
          </div>

          <div>
            <Image
              src="/assets/uniswap.png"
              className="cursor-pointer"
              alt="uniswap"
              width={100}
              height={100}
              onDoubleClick={() => handleIconDoubleClick("https://fayruz-story.vercel.app/")}
            />
          </div>
          
          <div>
            <Image
              src="/assets/new-dapp.png"
              className="cursor-pointer"
              alt="new"
              width={100}
              height={100}
              onDoubleClick={() => {
                if (!connectedAddress) return notification.error("Please connect your wallet");
                setNewDappModalIsOpen(true);
              }}
            />
          </div>
          {customDapps?.map((dapp, index) => {
            return (
              <div key={`${dapp.url}-${index}`} className="px-2 flex flex-col items-center justify-center gap-2">
                <Image
                  src="/assets/custom-dapp.png"
                  className="cursor-pointer"
                  alt="new"
                  width={70}
                  height={70}
                  onDoubleClick={() => {
                    setAppUrl(dapp.url);
                    setModalIsOpen(true);
                  }}
                />
                <p className="text-white text-center">{dapp.name}</p>
              </div>
            );
          })}
          <div className="px-2 flex flex-col items-center justify-center gap-2">
            <Image
              src="/assets/icon-add-folder.png"
              className="cursor-pointer"
              alt="new"
              width={70}
              height={70}
              onDoubleClick={() => {
                if (!connectedAddress) return notification.error("Please connect your wallet");
                setAddDappModalIsOpen(true);
              }}
            />
            <p className="text-white text-center">
              Add your <br /> dapp
            </p>
          </div>
        </div>
        <div>
          <TokenCounter />
        </div>
      </div>

      {connectedAddress && modalIsOpen && (
        <ModalIframe
          appUrl={debounceAppUrl}
          selectedNetwork={selectedNetwork}
          setModalIsOpen={setModalIsOpen}
          address={connectedAddress}
        />
      )}
      {newDappModalIsOpen && (
        <ModalNewDappInput
          appUrl={appUrl}
          setModalIsOpen={setNewDappModalIsOpen}
          setAppUrl={setAppUrl}
          onClick={() => {
            if (!isValidUrl(debounceAppUrl)) {
              return notification.error("Please enter a valid url");
            }
            setModalIsOpen(true);
            setNewDappModalIsOpen(false);
          }}
        />
      )}

      {addDappModalIsOpen && <ModalAddDappInput setModalIsOpen={setAddDappModalIsOpen} />}
    </>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "react95";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";

const erc4337Facts = [
  "Fayruz: Where AI meets the blockchain, and they become best friends forever.",
  "Why juggle chainsaws when you can juggle AI on the blockchain with Fayruz?",
  "Fayruz: Bringing the future of AI to your smart contracts, one byte at a time.",
  "Who needs magic when you've got the Fayruz Oracle? Abra-kadabra AI on-chain!",
  "Fayruz: Because AI and blockchain are the peanut butter and jelly of the tech world.",
  "Ever seen AI do a backflip on the blockchain? Fayruz can show you!",
  "Fayruz: Making your smart contracts smarter, faster, and a whole lot cooler.",
  "Solidity developers + Fayruz = AI superpowers right in your smart contracts!",
  "With Fayruz, your blockchain just learned how to think. Next up, world domination?",
  "Fayruz Oracle: Making asynchronous AI interactions so smooth, you'll think it's magic.",
  "Why settle for regular contracts when you can have contracts with AI swagger? Fayruz FTW!",
  "Fayruz: Because waiting for block confirmations is so last century.",
  "Fayruz Oracle: Like a fortune teller, but way more accurate and a lot more tech-savvy.",
  "Bring your smart contracts to life with Fayruz – AI on-chain has never been this easy!",
  "Want your blockchain to multitask like a pro? Fayruz is your go-to AI sidekick.",
  "Fayruz: Turning blockchain into a playground where AI gets to show off its tricks.",
  "Ready to turn your contracts into geniuses? Fayruz is here to make it happen.",
  "Fayruz: Where AI, blockchain, and your imagination come together to create magic."
];

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrencyPrice);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;
  const [tooltipText, setTooltipText] = useState(erc4337Facts[0]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % erc4337Facts.length;
      setTooltipText(erc4337Facts[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0 flex justify-end">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {nativeCurrencyPrice > 0 && (
              <div>
                <Button>
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>{nativeCurrencyPrice}</span>
                </Button>
              </div>
            )}
            {isLocalNetwork && (
              <>
                <Faucet />

                <Link href="/blockexplorer" passHref className="gap-1">
                  <Button>
                    <MagnifyingGlassIcon className="h-4 w-4" />
                    <span>Block Explorer</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/clippy-animation.gif"
          alt="clippy"
          className="w-[115px] m-4 mb-0 cursor-pointer"
          onClick={() => setIsTooltipVisible(prev => !prev)}
        />
        {isTooltipVisible && (
          <div className="max-w-[200px] absolute -left-[152px] -top-[117px] bg-gray-300 p-4 rounded-sm shadow-xl">
            <span className="absolute top-1 right-2 cursor-pointer" onClick={() => setIsTooltipVisible(false)}>
              X
            </span>
            <p className="m-0">{tooltipText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

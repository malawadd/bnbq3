'use client'

import React, { useCallback, useState } from 'react'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Avatar, Flex, Heading, IconButton, Tooltip } from '@radix-ui/themes'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import cs from 'classnames'
import Link from "next/link";
import NextLink from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { useTheme } from '../Themes'

export const Header = () => {
  const { isConnected } = useWeb3ModalAccount()

  const { theme, setTheme } = useTheme()
  const [, setShow] = useState(false)

  const toggleNavBar = useCallback(() => {
    setShow((state) => !state)
  }, [])

  if (!isConnected) {
    return <></>
  }
  return (
    <header
      className={cs('block shadow-sm sticky top-0 dark:shadow-gray-500 py-3 px-4 z-20')}
      style={{ backgroundColor: 'var(--background-color)' }}
    >
      <Flex align="center" gap="3">
        <NextLink href="/">
          <Heading as="h2" size="9" style={{ maxWidth: 1200, fontFamily: "PPNeueBit-Bold" }}>
           fayruz
          </Heading>
        </NextLink>
        <div
          style={{ fontFamily: "PPNeueBit-Bold" }}
          className="text-3xl hidden lg:inline"
        >
          on-chain ChatGPT (contract:
          <a
            href={`https://opbnb-testnet.bscscan.com//address/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
            target="_blank"
            className={"pl-2 underline"}
          >
            {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
          </a>
          )
        </div>
        <Flex align="center" gap="3" className="ml-auto">
          <Link href="https://www.bnbchain.org/en/testnet-faucet" target="_blank"
            className="px-3 py-2 rounded-md font-medium hover:underline hidden lg:inline">BNB Faucet</Link>
          <Link href="https://docs-fayruz.vercel.app/" target='_blank'
            className="px-3 py-2 rounded-md font-medium hover:underline hidden lg:inline">about</Link>
          <Avatar
            color="gray"
            size="2"
            radius="full"
            fallback={
              <a href="https://github.com/malawadd/fayruz" target={"_blank"}>
                <FaGithub />
              </a>
            }
          />
        </Flex>
        <Tooltip content="Navigation">
          <IconButton
            size="3"
            variant="ghost"
            color="gray"
            className="md:hidden"
            onClick={toggleNavBar}
          >
            <HamburgerMenuIcon width="16" height="16" />
          </IconButton>
        </Tooltip>
      </Flex>
    </header>
  )
}

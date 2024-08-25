'use client'

import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Flex, Heading, IconButton, ScrollArea, Tooltip } from '@radix-ui/themes'
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { BrowserProvider, Contract, ethers, TransactionReceipt } from "ethers";
import ContentEditable from 'react-contenteditable'
import toast from 'react-hot-toast'
import { AiOutlineClear, AiOutlineLoading3Quarters, AiOutlineUnorderedList } from 'react-icons/ai'
import { FiSend } from 'react-icons/fi'
import ProgressBar from "@/components/ProgressBar";
import { ABI } from "@/types/network";
import ChatContext from './chatContext'
import { ChatMessage } from './interface'
import Message from './Message'

import './index.scss'

const HTML_REGULAR =
  /<(?!img|table|\/table|thead|\/thead|tbody|\/tbody|tr|\/tr|td|\/td|th|\/th|br|\/br).*?>/gi

export interface ChatProps {
}

export interface ChatGPInstance {
  setConversation: (messages: ChatMessage[]) => void
  getConversation: () => ChatMessage[]
  focus: () => void
}


const Chat = (props: ChatProps, ref: any) => {
  const {
    debug,
    currentChatRef,
    saveMessages,
    onToggleSidebar,
    forceUpdate,
    saveChatId,
  } = useContext(ChatContext)

  const { walletProvider } = useWeb3ModalProvider()

  const [isLoading, setIsLoading] = useState(false)
  const [isTxLoading, setIsTxLoading] = useState(false)

  const conversationRef = useRef<ChatMessage[]>()

  const [message, setMessage] = useState('')

  const [currentMessage, setCurrentMessage] = useState<string>('')

  const textAreaRef = useRef<HTMLElement>(null)

  const conversation = useRef<ChatMessage[]>([])

  const bottomOfChatRef = useRef<HTMLDivElement>(null)
  const sendMessage = useCallback(
    async (e: any) => {
      if (!isLoading) {
        e.preventDefault()
        const input = textAreaRef.current?.innerHTML?.replace(HTML_REGULAR, '') || ''

        if (input.length < 1) {
          toast.error('Please type a message to continue.')
          return
        }
        if (!walletProvider) {
          toast.error("Not connected")
          return
        }

        const message = [...conversation.current]
        conversation.current = [...conversation.current, { content: input, role: 'user' }]
        setMessage('')
        setIsLoading(true)
        setIsTxLoading(true)
        try {
          const ethersProvider = new BrowserProvider(walletProvider)
          const signer = await ethersProvider.getSigner()
          const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "", ABI, signer)
          let receipt
          let chatId
          if (conversation.current.length === 1) {
            // Start chat
            const tx = await contract.startChat(input)
            receipt = await tx.wait()
            chatId = getChatId(receipt, contract)
            if (chatId) {
              saveChatId?.(chatId)
            }

          } else {
            chatId = currentChatRef?.current?.chatId
            const transactionResponse = await contract.addMessage(input, currentChatRef?.current?.chatId)
            receipt = await transactionResponse.wait()
          }
          setIsTxLoading(false)
          if (receipt && receipt.status) {
            conversation.current = [...message, {
              content: input,
              role: 'user',
              transactionHash: receipt.hash
            }]

            if (chatId) {
              if (currentChatRef?.current) {
                // TODO: does this work?
                currentChatRef.current.chatId = chatId
              }

              while (true) {
                const newMessages: ChatMessage[] = await getNewMessages(contract, chatId, conversation.current.length);
                if (newMessages) {
                  const lastMessage = newMessages.at(-1)
                  if (lastMessage) {
                    if (lastMessage.role == "assistant") {
                      conversation.current = [
                        ...conversation.current,
                        { content: lastMessage.content, role: "assistant" }
                      ]
                      break
                    } else {
                      // Simple solution to show function results, not ideal
                      conversation.current = [
                        ...conversation.current,
                        { content: lastMessage.content, role: "user" }
                      ]
                    }
                  }
                }
                await new Promise(resolve => setTimeout(resolve, 2000))
              }
            }

          }
          setIsLoading(false)
        } catch (error: any) {
          console.error(error)
          toast.error(error.message)
          setIsLoading(false)
          setIsTxLoading(false)
        }
      }
    },
    [currentChatRef, debug, isLoading]
  )

  function getChatId(receipt: TransactionReceipt, contract: Contract) {
    let chatId
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log)
        if (parsedLog && parsedLog.name === "ChatCreated") {
          // Second event argument
          chatId = ethers.toNumber(parsedLog.args[1])
        }
      } catch (error) {
        // This log might not have been from your contract, or it might be an anonymous log
        console.log("Could not parse log:", log)
      }
    }
    return chatId;
  }

  async function getNewMessages(
    contract: Contract,
    chatId: number,
    currentMessagesCount: number
  ): Promise<ChatMessage[]> {
    const messages = await contract.getMessageHistoryContents(chatId)
    const roles = await contract.getMessageHistoryRoles(chatId)

    const newMessages: ChatMessage[] = []
    messages.forEach((message: any, i: number) => {
      if (i >= currentMessagesCount) {
        newMessages.push({
          role: roles[i],
          content: messages[i]
        })
      }
    })
    return newMessages;
  }

  const handleKeypress = useCallback(
    (e: any) => {
      if (e.keyCode == 13 && !e.shiftKey) {
        sendMessage(e)
        e.preventDefault()
      }
    },
    [sendMessage]
  )

  const clearMessages = () => {
    conversation.current = []
    forceUpdate?.()
  }

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '50px'
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight + 2}px`
    }
  }, [message, textAreaRef])

  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversation, currentMessage])

  useEffect(() => {
    conversationRef.current = conversation.current
    if (currentChatRef?.current?.id) {
      saveMessages?.(conversation.current)
    }
  }, [currentChatRef, conversation.current, saveMessages])

  useEffect(() => {
    if (!isLoading) {
      textAreaRef.current?.focus()
    }
  }, [isLoading])

  useImperativeHandle(ref, () => {
    return {
      setConversation(messages: ChatMessage[]) {
        conversation.current = messages
        forceUpdate?.()
      },
      getConversation() {
        return conversationRef.current
      },
      focus: () => {
        textAreaRef.current?.focus()
      }
    }
  })

  return (
    <Flex direction="column" height="100%" className="relative" gap="3"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <Flex
        justify="between"
        align="center"
        py="3"
        px="4"
        style={{ backgroundColor: "#006c75" }}
      >
        <Heading size="4">{currentChatRef?.current?.persona?.name || 'None'}</Heading>
      </Flex>
      <ScrollArea
        className="flex-1 px-4"
        type="auto"
        scrollbars="vertical"
        style={{ height: '100%' }}
      >
        {conversation.current.map((item, index) => (
          <Message key={index} message={item} />
        ))}
        {currentMessage && <Message message={{ content: currentMessage, role: 'assistant' }} />}
        {isLoading &&
          <div className="pt-4">
            <ProgressBar duration={10} message="Waiting for response..." />
          </div>
        }
        <div ref={bottomOfChatRef}></div>
      </ScrollArea>
      <div className="px-4 pb-3">
        <Flex align="end" justify="between" gap="3" className="relative">
          <div className="rt-TextAreaRoot rt-r-size-1 rt-variant-surface flex-1 rounded-3xl chat-textarea"
            style={{ borderWidth: "1px" }}>
            <ContentEditable
              innerRef={textAreaRef}
              style={{
                minHeight: '24px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}
              className="rt-TextAreaInput text-base"
              html={message}
              disabled={isLoading}
              onChange={(e) => {
                setMessage(e.target.value.replace(HTML_REGULAR, ''))
              }}
              onKeyDown={(e) => {
                handleKeypress(e)
              }}
            />
            <div className="rt-TextAreaChrome"></div>
          </div>
          <Flex gap="3" className="absolute right-0 pr-4 bottom-2 pt">
            {isLoading && (
              <Flex
                width="6"
                height="6"
                align="center"
                justify="center"
                style={{ color: 'var(--accent-11)' }}
              >
                <AiOutlineLoading3Quarters className="animate-spin size-4" />
              </Flex>
            )}
            <Tooltip content={'Send Message'}>
              <IconButton
                variant="soft"
                disabled={isLoading}
                color="gray"
                size="2"
                className="rounded-xl cursor-pointer"
                onClick={sendMessage}
              >
                <FiSend className="size-4" />
              </IconButton>
            </Tooltip>
            <Tooltip content={'Clear Message'}>
              <IconButton
                variant="soft"
                color="gray"
                size="2"
                className="rounded-xl cursor-pointer"
                disabled={isLoading}
                onClick={clearMessages}
              >
                <AiOutlineClear className="size-4" />
              </IconButton>
            </Tooltip>
            <Tooltip content={'Toggle Sidebar'}>
              <IconButton
                variant="soft"
                color="gray"
                size="2"
                className="rounded-xl md:hidden cursor-pointer"
                disabled={isLoading}
                onClick={onToggleSidebar}
              >
                <AiOutlineUnorderedList className="size-4" />
              </IconButton>
            </Tooltip>
          </Flex>
        </Flex>
      </div>
    </Flex>
  )
}

export default forwardRef<ChatGPInstance, ChatProps>(Chat)

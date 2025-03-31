import React from 'react'

import { ChatProps } from '../types'

export default function ChatWindow({ messages, userId }: ChatProps) {
  return (
    <div className="mb-4 space-y-2 border-1 h-[80vh]">
        {messages.map((msg, i) => (
          <p key={i} className={msg.from === userId ? "text-right text-blue-400" : "text-left text-gray-300"}>
            {msg.message}
          </p>
        ))}
      </div>
  )
}

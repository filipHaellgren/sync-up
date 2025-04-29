import React from "react";
import { FriendType } from "../styles";

import { useCall } from "../context/CallContext";

export default function CallNotif() {
  const { isReceivingCall, answerVideoCall, hangUp, callerInfo } = useCall();

  return (
    <>
      {isReceivingCall ? (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={callerInfo.avatar}
              alt={callerInfo.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold text-gray-300">
                {callerInfo.name}
              </p>
              <p className="text-xs text-gray-400">Incoming Call...</p>
            </div>
          </div>
          { callerInfo && (

          <button
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
            onClick={() => answerVideoCall(callerInfo.id)}
          >
            Accept
          </button>
          )}
          <button
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
            onClick={hangUp}
          >
            Reject
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

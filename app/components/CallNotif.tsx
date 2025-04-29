import React from 'react'
import { FriendType,  } from '../styles';

import { useCall } from '../context/CallContext';

export default   function CallNotif({callId, friend} : { callId: string; friend: FriendType;})  {
    const { isReceivingCall, answerVideoCall, hangUp } = useCall();


   



    return (
        <>
          {isReceivingCall ? (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={friend.avatarfull}
                  alt={friend.personaname}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-300">{friend.personaname}</p>
                  <p className="text-xs text-gray-400">Incoming Call...</p>
                </div>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
                onClick={() => answerVideoCall(callId)}
              >
                Accept
              </button>
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
 
import React, { createContext, useContext, useState, useEffect } from "react"; // Added useEffect
import { FriendType, ProfileType } from "../styles";
import { startCall, answerCall } from "@/lib/webrtc";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CallContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  callId: string | null;
  callerInfo: { id: string; name: string; avatar: string } | null;
  isCalling: boolean;
  isReceivingCall: boolean;
  error: string | null;
  availableAudioInputDevices: MediaDeviceInfo[]; // New state
  availableVideoInputDevices: MediaDeviceInfo[]; // New state
  selectedAudioInputDeviceId: string | undefined; // New state
  selectedVideoInputDeviceId: string | undefined; // New state
  getMediaDevices: () => Promise<void>; // New function
  getLocalStream: () => Promise<void>;
  startVideoCall: (friend: FriendType, user: ProfileType) => Promise<void>;
  startAudioCall: (friend: FriendType, user: ProfileType) => Promise<void>; // New function
  answerVideoCall: (callId: string) => Promise<void>;
  answerAudioCall: (callId: string) => Promise<void>; // New function
  hangUp: () => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setIsReceivingCall: (isReceiving: boolean) => void;
  setCallId: (callId: string | null) => void;
  setCallerInfo: (
    info: { id: string; name: string; avatar: string } | null
  ) => void;
  selectAudioInputDevice: (deviceId: string) => void; // New function
  selectVideoInputDevice: (deviceId: string) => void; // New function
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [isReceivingCall, setIsReceivingCall] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [callerInfo, setCallerInfo] = useState<{
    id: string;
    name: string;
    avatar: string;
  } | null>(null);
  const [availableAudioInputDevices, setAvailableAudioInputDevices] = useState<
    MediaDeviceInfo[]
  >([]);
  const [availableVideoInputDevices, setAvailableVideoInputDevices] = useState<
    MediaDeviceInfo[]
  >([]);
  const [selectedAudioInputDeviceId, setSelectedAudioInputDeviceId] = useState<
    string | undefined
  >();
  const [selectedVideoInputDeviceId, setSelectedVideoInputDeviceId] = useState<
    string | undefined
  >();

  const getMediaDevices = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true }); // Request permissions first
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputDevices: MediaDeviceInfo[] = [];
      const videoInputDevices: MediaDeviceInfo[] = [];

      devices.forEach((device) => {
        if (device.kind === "audioinput") {
          audioInputDevices.push(device);
        } else if (device.kind === "videoinput") {
          videoInputDevices.push(device);
        }
      });

      setAvailableAudioInputDevices(audioInputDevices);
      setAvailableVideoInputDevices(videoInputDevices);

      // Select the first available devices as defaults (or you could have more sophisticated logic)
      if (audioInputDevices.length > 0) {
        setSelectedAudioInputDeviceId(audioInputDevices[0].deviceId);
      }
      if (videoInputDevices.length > 0) {
        setSelectedVideoInputDeviceId(videoInputDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Error enumerating devices:", err);
      setError("Error enumerating devices.");
    }
  };

  const getLocalStream = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedAudioInputDeviceId
          ? { deviceId: { exact: selectedAudioInputDeviceId } }
          : true, // Use default if none selected
        video: selectedVideoInputDeviceId
          ? { deviceId: { exact: selectedVideoInputDeviceId } }
          : true, // Use default if none selected
      };

      console.log("Getting local stream with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      setError(null);
      console.log("Local stream obtained successfully.");
    } catch (err: any) {
      console.error("Error accessing media devices.", err);
      setError("Error accessing media devices: " + err.message); // Include error message
    }
  };

  const startVideoCall = async (friend: FriendType, user: ProfileType) => {
    await getLocalStream(); // Ensure stream with selected devices
    if (!localStream) return;
    try {
      const handleRemoteStream = (stream: MediaStream) => {
        console.log("Remote stream arrived in CallContext!", stream);
        setRemoteStream(stream);
      };
      const pc = await startCall(
        localStream,
        friend.steamid,
        handleRemoteStream
      );
      setPeerConnection(pc);
      setCallId(friend.steamid);
      setIsCalling(true);
      setError(null);
      console.log("Video call started successfully.");

      const incomingCallRef = doc(db, "incomingCalls", friend.steamid);
      await setDoc(incomingCallRef, {
        callerId: user.steamid,
        callerName: user.personaname,
        callerAvatar: user.avatarfull,
        calleeId: friend.steamid,
        callId: friend.steamid,
        isVideoCall: true, // Indicate this is a video call
      });
    } catch (err) {
      console.error("Error starting video call.", err);
      setError("Error starting video call.");
    }
  };

  const startAudioCall = async (friend: FriendType, user: ProfileType) => {
    try {
      // Get audio-only stream
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: selectedAudioInputDeviceId
          ? { deviceId: { exact: selectedAudioInputDeviceId } }
          : true,
        video: false, // No video!
      });
      setLocalStream(audioStream);

      const handleRemoteStream = (stream: MediaStream) => {
        console.log("Remote stream arrived in CallContext!", stream);
        setRemoteStream(stream);
      };

      const pc = await startCall(
        audioStream,
        friend.steamid,
        handleRemoteStream
      );
      setPeerConnection(pc);
      setCallId(friend.steamid);
      setIsCalling(true);
      setError(null);
      console.log("Audio call started successfully.");

      const incomingCallRef = doc(db, "incomingCalls", friend.steamid);
      await setDoc(incomingCallRef, {
        callerId: user.steamid,
        callerName: user.personaname,
        callerAvatar: user.avatarfull,
        calleeId: friend.steamid,
        callId: friend.steamid,
        isVideoCall: false, // Indicate audio-only
      });
    } catch (err: any) {
      console.error("Error starting audio call.", err);
      setError("Error starting audio call: " + err.message);
    }
  };

  const answerVideoCall = async (callId: string) => {
    await getLocalStream(); // Ensure stream with selected devices
    if (!localStream) return;
    try {
      const handleRemoteStream = (stream: MediaStream) => {
        console.log("Remote stream arrived in CallContext!", stream);
        setRemoteStream(stream);
      };
      const pc = await answerCall(localStream, callId, handleRemoteStream);
      setPeerConnection(pc);
      setCallId(callId);
      setIsReceivingCall(true);
      setError(null);
      console.log("Video call answered successfully.");
    } catch (err) {
      console.error("Error answering video call.", err);
      setError("Error answering video call.");
    }
  };

  const answerAudioCall = async (callId: string) => {
    try {
      // Get audio-only stream
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: selectedAudioInputDeviceId
          ? { deviceId: { exact: selectedAudioInputDeviceId } }
          : true,
        video: false,
      });
      setLocalStream(audioStream);

      const handleRemoteStream = (stream: MediaStream) => {
        console.log("Remote stream arrived in CallContext!", stream);
        setRemoteStream(stream);
      };
      const pc = await answerCall(audioStream, callId, handleRemoteStream);
      setPeerConnection(pc);
      setCallId(callId);
      setIsReceivingCall(true);
      setError(null);
      console.log("Audio call answered successfully.");
    } catch (err: any) {
      console.error("Error answering audio call.", err);
      setError("Error answering audio call: " + err.message);
    }
  };

  const hangUp = async () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
      setRemoteStream(null);
      setCallId(null);
      setIsCalling(false);
      setIsReceivingCall(false);
      setCallerInfo(null);
      if (callId) {
        const incomingCallRef = doc(db, "incomingCalls", callId);
        await deleteDoc(incomingCallRef);
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop()); // Stop all tracks
        setLocalStream(null);
      }
      console.log("Call ended.");
    }
  };

  const selectAudioInputDevice = (deviceId: string) => {
    setSelectedAudioInputDeviceId(deviceId);
  };

  const selectVideoInputDevice = (deviceId: string) => {
    setSelectedVideoInputDeviceId(deviceId);
  };

  useEffect(() => {
    getMediaDevices();
  }, []);

  const value: CallContextType = {
    localStream,
    remoteStream,
    peerConnection,
    callId,
    isCalling,
    callerInfo,
    isReceivingCall,
    error,
    availableAudioInputDevices,
    availableVideoInputDevices,
    selectedAudioInputDeviceId,
    selectedVideoInputDeviceId,
    getMediaDevices,
    getLocalStream,
    startVideoCall,
    startAudioCall,
    answerVideoCall,
    answerAudioCall,
    hangUp,
    setRemoteStream,
    setIsReceivingCall,
    setCallId,
    setCallerInfo,
    selectAudioInputDevice,
    selectVideoInputDevice,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

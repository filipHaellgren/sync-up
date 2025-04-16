// lib/webrtc.ts
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

let localPeerConnection: RTCPeerConnection | null = null;
let remoteStream: MediaStream | null = null;

/**
 * Starts a WebRTC call by creating an offer and saving it to Firestore.
 */
export async function startCall(callerId: string, calleeId: string) {
  const callId = `${callerId}_${calleeId}`;
  const callDoc = doc(db, "calls", callId);
  const callerCandidatesCollection = collection(callDoc, "callerCandidates");

  localPeerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  // Send ICE candidates to Firestore
  localPeerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(callerCandidatesCollection, event.candidate.toJSON());
    }
  };

  // Get local media stream
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  // Add tracks to connection
  localStream.getTracks().forEach((track) => {
    localPeerConnection!.addTrack(track, localStream);
  });

  // Create and store offer
  const offer = await localPeerConnection.createOffer();
  await localPeerConnection.setLocalDescription(offer);

  await setDoc(callDoc, {
    offer,
    callerId,
    calleeId,
    status: "calling", // 🟢 Optional: for status tracking (e.g. "calling", "answered", "declined")
  });

  return { callId, callDoc, pc: localPeerConnection, localStream };
}

/**
 * Answers an incoming WebRTC call using the callId and sets up the peer connection.
 */
export async function answerCall(callId: string) {
  const callDoc = doc(db, "calls", callId);
  const answerCandidatesCollection = collection(callDoc, "calleeCandidates");
  const offerCandidatesCollection = collection(callDoc, "callerCandidates");

  const callData = (await getDoc(callDoc)).data();
  if (!callData?.offer) {
    console.error("❌ No offer found");
    return;
  }

  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  // Get local stream
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  // Add local tracks to the connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  // Save ICE candidates
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(answerCandidatesCollection, event.candidate.toJSON());
    }
  };

  // Handle remote stream
  remoteStream = new MediaStream();
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream!.addTrack(track);
    });
  };

  // Set remote offer
  await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));

  // Create and send answer
  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  await setDoc(callDoc, { answer: answerDescription, status: "answered" }, { merge: true });

  // Listen for remote ICE candidates
  onSnapshot(offerCandidatesCollection, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });

  return { pc, localStream, remoteStream };
}
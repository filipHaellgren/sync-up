import { useEffect, useRef, useState } from "react";

export function useUserMediaDevices() {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);

  const [selectedInputDeviceId, setSelectedInputDeviceId] = useState<string>();
  const [selectedOutputDeviceId, setSelectedOutputDeviceId] =
    useState<string>();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchDevices() {
      try {
        //seeks access for audio media devices
        await navigator.mediaDevices.getUserMedia({ audio: true });

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const inputList = allDevices.filter((d) => d.kind === "audioinput");
        const outputList = allDevices.filter((d) => d.kind === "audiooutput");

        setInputDevices(inputList);
        setOutputDevices(outputList);
//sets first device to default
        if (inputList.length > 0 && !selectedInputDeviceId) {
          setSelectedInputDeviceId(inputList[0].deviceId);
        }
        if (outputList.length > 0 && !selectedOutputDeviceId) {
          setSelectedOutputDeviceId(outputList[0].deviceId);
        }
      } catch (err) {
        setError(err as Error);
      }
    }

    fetchDevices();
  }, []);

  useEffect(() => {
    if (!selectedInputDeviceId) return;

    async function setAudio() {
      try {
        if (audioStream) {
          audioStream.getTracks().forEach((track) => track.stop());
        }
//connects audio stream to selected input device
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: selectedInputDeviceId },
        });

        setAudioStream(stream);

        if (audioRef.current) {
          audioRef.current.srcObject = stream;
          await audioRef.current.play();
//does the same for output
          if (selectedOutputDeviceId && "setSinkId" in audioRef.current) {
            await (audioRef.current as any).setSinkId(selectedOutputDeviceId);
          }
        }
      } catch (err) {
        setError(err as Error);
      }
    }

    setAudio();

    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedInputDeviceId, selectedOutputDeviceId]);

  return {
    audioRef,
    audioStream,
    error,
    inputDevices,
    outputDevices,
    selectedInputDeviceId,
    setSelectedInputDeviceId,
    selectedOutputDeviceId,
    setSelectedOutputDeviceId,
  };
}

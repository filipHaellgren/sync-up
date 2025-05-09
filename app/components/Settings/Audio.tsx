import React from 'react'
import { useUserMediaDevices } from "../../hooks/useUserMediaDevices";

export default function Audio() {
  const { inputDevices, outputDevices, selectedInputDeviceId, selectedOutputDeviceId, setSelectedInputDeviceId ,setSelectedOutputDeviceId, audioStream, error } =
    useUserMediaDevices();

  return (
   
      <div>
      <h2>Select Input</h2>
      {inputDevices.length === 0 && <p>No microphones found</p>}
      <h2>Select Output</h2>
       {outputDevices.length === 0 && <p>No Speakers/Headphones found</p>}

      <select
        value={selectedInputDeviceId || ""}
        onChange={(e) => setSelectedInputDeviceId(e.target.value)}
      >
        {inputDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Microphone ${device.deviceId}`}
          </option>
        ))}
      </select>

          <select
        value={selectedOutputDeviceId || ""}
        onChange={(e) => setSelectedOutputDeviceId(e.target.value)}
      >
        {outputDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Speaker/ Headphone ${device.deviceId}`}
          </option>
        ))}
      </select>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
    </div>
      
   
  )
}



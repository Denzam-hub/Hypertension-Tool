import { useEffect, useRef, useState } from "react";
import { getMonitorSocket, onBPReading as registerBPListener, onPrediction as registerPredictionListener } from "../services/socket";

export default function useSocket({
  isLive,
  onBPReading,
  onPrediction,
  onError
}) {
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [error, setError] = useState("");
  const isLiveRef = useRef(isLive);
  
  useEffect(() => {
    isLiveRef.current = isLive;
  }, [isLive]);

  useEffect(() => {
    // Use the centralized socket service instead of creating a new one
    const socket = getMonitorSocket();
    
    if (!socket) {
      setConnectionStatus("error");
      setError("Failed to establish connection: No authentication token");
      if (onError) onError();
      return;
    }

    // Set up event listeners
    const handleConnect = () => {
      setConnectionStatus("connected");
      setError("");
    };
    
    const handleDisconnect = () => {
      setConnectionStatus("disconnected");
      setError("Connection to server lost. Please refresh the page.");
      if (onError) onError();
    };
    
    const handleConnectError = (err) => {
      setConnectionStatus("error");
      setError(`Connection error: ${err.message}`);
      if (onError) onError();
    };

    // Register health event handlers
    const bpReadingCleanup = registerBPListener((data) => {
      if (isLiveRef.current && onBPReading) onBPReading(data);
    });
    
    const predictionCleanup = registerPredictionListener((data) => {
      if (isLiveRef.current && onPrediction) onPrediction(data);
    });

    // Add socket event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    // Check initial connection status
    setConnectionStatus(socket.connected ? "connected" : "disconnected");

    // Cleanup when component unmounts
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      
      if (bpReadingCleanup) bpReadingCleanup();
      if (predictionCleanup) predictionCleanup();
    };
  }, [onBPReading, onPrediction, onError]);

  return { connectionStatus, error };
}
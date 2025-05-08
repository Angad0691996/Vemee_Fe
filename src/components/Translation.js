import { useState } from "react";
import React, { useEffect, useRef } from "react";
import { connectSocket, socket } from "../utils/socket";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Translation = () => {
  const {
    transcript,
    listening,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const useStateWithLatestValue = (initialValue) => {
    const [value, setValue] = useState(initialValue);
    const valueRef = useRef(value);
    useEffect(() => {
      valueRef.current = value;
    }, [value]);
    return [value, setValue, valueRef];
  };
  const listenRef = useRef(listening);
  const [isPaused, setIsPaused, isPausedRef] = useStateWithLatestValue(true);
  useEffect(() => {
    listenRef.current = listening;
  }, [listening]);
  useEffect(() => {
    connectSocket();
    socket.on("start-translate", () => {
      console.log(
        "start-translate called",
        !listenRef.current && !isPausedRef.current
      );
      if (!listenRef.current && !isPausedRef.current) {
        console.log("start listening");
        SpeechRecognition.startListening({
          language: "en-IN",
          continuous: true,
        });
      }
    });
    socket.on("translate", (val) => {
      console.log("msg received", val.text);
    });
  }, []);
  useEffect(() => {
    if (!finalTranscript) {
      return;
    }
    console.log(finalTranscript);
    if (socket.connected) {
      socket.emit("translate", {
        text: finalTranscript,
        room: "roomName",
        timestamp: Date.now(),
        src_lang: "en-IN",
        user: "User 1",
      });
    }
    resetTranscript();
  }, [finalTranscript]);
  const startTranslate = () => {
    // setTimeout(() => {
    socket.emit("start-translate", {
      room: "roomName",
      timestamp: Date.now(),
      user: "User1",
      to: null,
    });
    // }, 1000);
  };
  const stopTranslate = () => {
    SpeechRecognition.stopListening();
  };
  const togglePaused = () => {
    setIsPaused((prev) => !prev);
  };
  return (
    <>
      {listening ? "listening" : "not listening"}
      <button onClick={startTranslate}>Start</button>
      <button onClick={stopTranslate}>Stop</button>
      <button onClick={togglePaused}>{isPaused ? "Paused" : "Unpaused"}</button>
    </>
  );
};

export default Translation;

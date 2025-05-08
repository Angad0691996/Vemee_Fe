import { useState, useEffect } from "react";

function ScreenRecorder() {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  function mixer(stream1, stream2) {
    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();

    if (stream1.getAudioTracks().length > 0)
      ctx.createMediaStreamSource(stream1).connect(dest);

    if (stream2.getAudioTracks().length > 0)
      ctx.createMediaStreamSource(stream2).connect(dest);

    let tracks = dest.stream.getTracks();

    tracks = tracks
      .concat(stream1.getVideoTracks())
      .concat(stream2.getVideoTracks());
    return new MediaStream(tracks);
  }
  const startRecording = async () => {
    let gumStream, gdmStream;

    gumStream = await navigator.mediaDevices.getUserMedia({
      // video: false,
      audio: true,
    });
    gdmStream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" },
      audio: { channelCount: 2 },
    });

    const mixedStream = mixer(gumStream, gdmStream);

    // let stream = new MediaStream(tracks);

    const mediaRecorder = new MediaRecorder(mixedStream);
    mediaRecorder.stream.getTracks().forEach((track) =>
      track.addEventListener("ended", () => {
        console.log("ended");
        mediaRecorder.stop();
        setRecording(false);
      })
    );
    setMediaRecorder(mediaRecorder);

    mediaRecorder.ondataavailable = (e) => {
      setVideoUrl(URL.createObjectURL(e.data));
    };
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const startAudio = async () => {
    let gumStream, gdmStream;

    gumStream = await navigator.mediaDevices.getUserMedia({
      // video: false,
      audio: true,
    });
    gdmStream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" },
      audio: { channelCount: 2 },
    });

    const mixedStream = mixer(gumStream, gdmStream);

    // let stream = new MediaStream(tracks);

    const mediaRecorder = new MediaRecorder(mixedStream);
    mediaRecorder.stream.getTracks().forEach((track) =>
      track.addEventListener("ended", () => {
        console.log("ended");
        mediaRecorder.stop();
        setRecording(false);
      })
    );
    setMediaRecorder(mediaRecorder);

    mediaRecorder.ondataavailable = (e) => {
      setAudioUrl(URL.createObjectURL(e.data, { type: "audio/wav" }));
    };
    mediaRecorder.start();
    setRecording(true);
  };

  const stopAudio = () => {
    if (mediaRecorder) {
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  useEffect(() => {
    if (audioUrl) {
      const anchor = document.createElement("a");
      anchor.href = audioUrl;
      anchor.download = "recording.wav";
      anchor.click();
      // document.removeChild(anchor);
    }
  }, [audioUrl]);
  useEffect(() => {
    // download video
    if (videoUrl) {
      const anchor = document.createElement("a");
      anchor.href = videoUrl;
      anchor.download = "recording.mp4";
      anchor.click();
      // document.removeChild(anchor);
    }
  }, [videoUrl]);

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      <button onClick={startAudio} disabled={recording}>
        Start Audio Recording
      </button>
      <button onClick={stopAudio} disabled={!recording}>
        Stop Audio Recording
      </button>
      {videoUrl && <video src={videoUrl} controls />}
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
}

export default ScreenRecorder;

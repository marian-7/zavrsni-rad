import jsQR from "jsqr";
import MobileDetect from "mobile-detect";
import React, { FC, memo, useCallback, useEffect, useRef } from "react";
import styles from "styles/components/qr-scanner.module.scss";
import { paths } from "paths";
import * as queryString from "querystring";
import { Session } from "next-auth";
import { useRouter } from "next/router";

type Props = {
  delay?: number;
  session: Session;
};

export const QrScanner: FC<Props> = memo(function QrScanner(props) {
  const { video, canvas } = useQrScanner({ ...props, delay: 300 });

  return (
    <div className={styles.qr}>
      <video autoPlay ref={video} className={styles.video} />
      <div className={styles.overlay} />
      <canvas ref={canvas} className={styles.canvas} />
    </div>
  );
});

function useQrScanner(props: Props) {
  const { delay, session } = props;
  const interval = useRef<NodeJS.Timeout | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stream = useRef<MediaStream | null>(null);

  const { replace } = useRouter();

  const redirect = useCallback(
    (location: string) => {
      return replace(location);
    },
    [replace]
  );

  const parse = useCallback(
    (data: ImageData) => {
      const code = jsQR(data.data, data.width, data.height, {
        inversionAttempts: "dontInvert",
      });
      if (code) {
        const qrData = code.data;
        try {
          const url = new URL(qrData);
          if (url) {
            stopDrawing();
            stopStream();
            if (session) {
              redirect(`${url.pathname}${url.search}`);
            } else {
              const splitString = qrData.split("/").reverse();
              const tableId = splitString[0];
              redirect(`${paths.login()}?${queryString.stringify({ tableId })}`);
            }
            navigator.vibrate([300]);
          }
          // tslint:disable-next-line:no-empty
        } catch (e) {}
      }
    },
    [redirect, session]
  );

  const draw = useCallback(
    (
      videoEl: HTMLVideoElement,
      canvasEl: HTMLCanvasElement,
      context: CanvasRenderingContext2D,
      frameRate: number
    ) => {
      interval.current = setInterval(() => {
        context.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

        const size = 200;
        const centerX = videoEl.videoWidth / 2;
        const centerY = videoEl.videoHeight / 2;
        const data = context.getImageData(centerX - size / 2, centerY - size / 2, size, size);
        parse(data);
      }, frameRate);
    },
    [parse]
  );

  const handleLoadedmetadata = useCallback(
    (videoEl: HTMLVideoElement, canvasEl: HTMLCanvasElement) => {
      canvasEl.width = videoEl.videoWidth;
      canvasEl.height = videoEl.videoHeight;
      const context = canvasEl.getContext("2d");
      if (context !== null && delay) {
        draw(videoEl, canvasEl, context, delay);
      }
    },
    [delay, draw]
  );

  const handleUserMedia = useCallback(
    (s: MediaStream) => {
      const videoEl = video.current;
      const canvasEl = canvas.current;
      stream.current = s;
      if (videoEl !== null && canvasEl !== null) {
        videoEl.srcObject = s;
        videoEl.onloadedmetadata = () => {
          handleLoadedmetadata(videoEl, canvasEl);
        };
      }
    },
    [handleLoadedmetadata]
  );

  useEffect(() => {
    const { innerWidth, innerHeight } = window;
    const dimensions = getDimensions(innerWidth, innerHeight);

    const constraints = {
      audio: false,
      video: {
        width: { max: dimensions.width },
        height: { max: dimensions.height },
        facingMode: "environment",
      },
    };
    navigator.mediaDevices.getUserMedia(constraints).then(handleUserMedia).catch(console.log);

    return () => {
      stopDrawing();
      stopStream();
    };
  }, [handleUserMedia]);

  function getDimensions(w: number, h: number) {
    const md = new MobileDetect(window.navigator.userAgent);
    const dimensions = { width: w, height: h };

    if (md.phone() || md.tablet()) {
      if (window.matchMedia("(orientation:portrait)").matches) {
        if (md.userAgent() !== "Safari" || md.is("iPhone")) {
          dimensions.width = h;
          dimensions.height = w;
        }
      }
    }

    return dimensions;
  }

  function stopStream() {
    if (stream.current) {
      stream.current.getTracks()[0].stop();
    }
    if (video.current) {
      video.current.srcObject = null;
    }
  }

  function stopDrawing() {
    if (interval.current) {
      clearInterval(interval.current);
    }
  }

  return { video, canvas };
}

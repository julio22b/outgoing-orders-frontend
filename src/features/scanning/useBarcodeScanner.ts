import { useEffect, useRef, useState } from 'react';

const DETECTOR_FORMATS = ['code_128'];
const DETECT_INTERVAL_MS = 200;
const HAVE_CURRENT_DATA = 2;

let cachedDetector: BarcodeDetector | null | undefined;

const getDetector = () => {
    if (cachedDetector !== undefined) {
        return cachedDetector;
    }

    if (!('BarcodeDetector' in window) || !navigator.mediaDevices) {
        cachedDetector = null;
        return cachedDetector;
    }

    try {
        cachedDetector = new BarcodeDetector({ formats: DETECTOR_FORMATS });
    } catch {
        cachedDetector = null;
    }
    return cachedDetector;
};

const readCameraError = (error: unknown) => {
    const name = error instanceof DOMException ? error.name : '';
    if (name === 'NotAllowedError') {
        return 'Camera permission was denied. The field above still takes scans.';
    }
    if (name === 'NotFoundError') {
        return 'No camera was found. The field above still takes scans.';
    }
    return "The camera couldn't be started. The field above still takes scans.";
};

export const useBarcodeScanner = (onDetect: (value: string) => void) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const onDetectRef = useRef(onDetect);
    const detector = getDetector();
    const [cameraError, setCameraError] = useState<string | null>(null);

    // onDetect is a new function on every render, so a dep array would run this every render anyway
    useEffect(() => {
        onDetectRef.current = onDetect;
    });

    useEffect(() => {
        const video = videoRef.current;
        if (!detector || !video) return;

        let isCancelled = false;
        let stream: MediaStream | null = null;
        let frameRequest = 0;
        let lastAttemptAt = 0;
        let isDetecting = false;

        const scanFrame = async (timestamp: number) => {
            frameRequest = requestAnimationFrame(scanFrame);

            if (video.readyState < HAVE_CURRENT_DATA) return;
            if (isDetecting || timestamp - lastAttemptAt < DETECT_INTERVAL_MS) return;

            lastAttemptAt = timestamp;
            isDetecting = true;
            try {
                const barcodes = await detector.detect(video);
                if (!isCancelled && barcodes.length > 0) {
                    onDetectRef.current(barcodes[0].rawValue);
                }
            } catch {
                // one frame failing to decode says nothing about the next one
            } finally {
                isDetecting = false;
            }
        };

        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
            .then((cameraStream) => {
                if (isCancelled) {
                    cameraStream.getTracks().forEach((track) => track.stop());
                    return;
                }
                stream = cameraStream;
                video.srcObject = cameraStream;
                frameRequest = requestAnimationFrame(scanFrame);
            })
            .catch((error: unknown) => {
                if (isCancelled) return;
                setCameraError(readCameraError(error));
            });

        return () => {
            isCancelled = true;
            cancelAnimationFrame(frameRequest);
            stream?.getTracks().forEach((track) => track.stop());
            video.srcObject = null;
        };
    }, [detector]);

    return { isSupported: detector !== null, videoRef, cameraError };
};

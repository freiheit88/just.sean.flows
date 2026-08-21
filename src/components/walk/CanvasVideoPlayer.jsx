import React, { useEffect, useRef } from 'react';

export function CanvasVideoPlayer({ videoSrc, posterSrc, isActive }) {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const animRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');

        const renderLoop = () => {
            if (video && !video.paused && !video.ended && ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            animRef.current = requestAnimationFrame(renderLoop);
        };

        if (isActive) {
            video.currentTime = 0;
            video.muted = false;
            video.volume = 1.0;
            video.play().catch(() => {
                video.muted = true;
                video.play().catch(() => {});
            });
            animRef.current = requestAnimationFrame(renderLoop);
        } else {
            video.pause();
            if (animRef.current) cancelAnimationFrame(animRef.current);
        }

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [isActive]);

    return (
        <div className="relative w-full h-full overflow-hidden pointer-events-none">
            {/* Hidden Background Video Element (No Samsung/iOS Video Assistant Detection) */}
            <video
                ref={videoRef}
                src={videoSrc}
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                x5-video-player-type="h5"
                x5-video-player-fullscreen="false"
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                preload="auto"
                className="absolute opacity-0 pointer-events-none w-1 h-1 -top-10 -left-10"
            />

            {/* Seamless 60FPS Canvas Surface (Renders purely as pixel graphic) */}
            <canvas
                ref={canvasRef}
                width={720}
                height={1280}
                className="w-full h-full object-cover"
            />
        </div>
    );
}

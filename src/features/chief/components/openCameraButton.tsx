import React, { useRef, useState, useEffect } from 'react';
import { Fab, Dialog, IconButton, Box, Typography } from '@mui/material';
import TargetIcon from '../assets/TargetIcon.svg';
import CloseIcon from '@mui/icons-material/Close';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { makeStyles } from 'tss-react/mui';
import { PhotoDialog } from './photoDialog';

const useStyles = makeStyles()(() => ({
    fab: {
        backgroundColor: '#000000',
        color: '#ffffff',
        border: '3px solid #ffffff',
        boxShadow: '0 0 0 3px #000000',
        width: '74px',
        height: '74px',
        minHeight: '74px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'transform 0.1s ease',
        '&:active': {
            transform: 'scale(0.92)',
        },
    },
    icon: {
        width: '44px',
        height: '44px',
    },
    dialogPaper: {
        backgroundColor: '#000000',
        color: '#ffffff',
        margin: 0,
        width: '100vw',
        height: '100vh',
        maxWidth: 'none !important',
        maxHeight: 'none !important',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    cameraContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 55,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        zIndex: 10,
    },
    galleryButton: {
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },
    placeholder: {
        width: '50px',
        height: '50px',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        zIndex: 10,
    },
    errorText: {
        color: '#ff1744',
        textAlign: 'center',
        padding: 16,
    },
}));

interface OpenCameraButtonProps {
    onCapture?: (file: File, previewUrl: string) => void;
    size?: 'small' | 'medium' | 'large';
}

export const OpenCameraButton: React.FC<OpenCameraButtonProps> = ({
    onCapture,
    size = 'large',
}) => {
    const { classes } = useStyles();
    const [isOpen, setIsOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // States for the captured image (passed to photoDialog)
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [capturedFile, setCapturedFile] = useState<File | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const startCamera = async (mode: 'user' | 'environment') => {
        try {
            setErrorMsg(null);
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: mode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            });

            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err: any) {
            console.error('Error accessing camera:', err);
            setErrorMsg('אין הרשאות למצלמה');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        if (isOpen && !capturedImage) {
            startCamera(facingMode);
        } else {
            stopCamera();
        }
        return () => {
            stopCamera();
        };
    }, [isOpen, capturedImage, facingMode]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;

                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
                        const previewUrl = URL.createObjectURL(blob);

                        setCapturedFile(file);
                        setCapturedImage(previewUrl);
                    }
                }, 'image/jpeg', 0.9);
            }
        }
    };

    const handleGalleryClick = () => {
        if (galleryInputRef.current) {
            galleryInputRef.current.click();
        }
    };

    const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const previewUrl = URL.createObjectURL(file);

            setCapturedFile(file);
            setCapturedImage(previewUrl);
        }
    };

    const handleRecapture = () => {
        setCapturedImage(null);
        setCapturedFile(null);
    };

    const handleAccept = (file: File, previewUrl: string) => {
        if (onCapture) {
            onCapture(file, previewUrl);
        }
        alert('Photo accepted!');
        setIsOpen(false);
        setCapturedImage(null);
        setCapturedFile(null);
    };

    return (
        <>
            <Fab
                className={classes.fab}
                size={size}
                onClick={() => setIsOpen(true)}
                aria-label="open camera"
            >
                <img src={TargetIcon} className={classes.icon} alt="Target" />
            </Fab>

            {/* Hidden canvas for taking snapshot */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Only show camera dialog if no image is captured yet */}
            <Dialog
                open={isOpen && !capturedImage}
                onClose={() => setIsOpen(false)}
                fullScreen
                slotProps={{
                    paper: {
                        className: classes.dialogPaper,
                    },
                }}
            >
                <IconButton
                    className={classes.closeButton}
                    onClick={() => setIsOpen(false)}
                    aria-label="close camera"
                >
                    <CloseIcon />
                </IconButton>

                <Box className={classes.cameraContainer} sx={{ height: '100%', width: '100%' }}>
                    {errorMsg ? (
                        <Typography className={classes.errorText} variant="h6">
                            {errorMsg}
                        </Typography>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={classes.video}
                        />
                    )}

                    <input
                        type="file"
                        accept=".png, .jpg, .jpeg, .webp"
                        ref={galleryInputRef}
                        onChange={handleGalleryChange}
                        style={{ display: 'none' }}
                        id="gallery-input"
                    />

                    <Box className={classes.controlsContainer}>
                        <Box className={classes.placeholder} />

                        <Box className={classes.fab} onClick={handleCapture}>
                            <img src={TargetIcon} className={classes.icon} alt="Capture" />
                        </Box>

                        <IconButton
                            className={classes.galleryButton}
                            onClick={handleGalleryClick}
                            aria-label="choose from gallery"
                        >
                            <PhotoLibraryIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Dialog>

            {/* The preview dialog, shown when an image is captured */}
            <PhotoDialog
                isOpen={!!capturedImage}
                capturedImage={capturedImage}
                capturedFile={capturedFile}
                onRecapture={handleRecapture}
                onAccept={handleAccept}
            />
        </>
    );
};

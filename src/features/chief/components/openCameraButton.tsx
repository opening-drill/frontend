import React, { useRef, useState, useEffect } from 'react';
import { Dialog, IconButton, Box, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { makeStyles } from 'tss-react/mui';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import { PhotoDialog } from './photoDialog';
import { useDeviceLocation } from '../../../core/store/atoms/locationAtom';
import { sendAiPipelineReport } from '../../../core/server/api/reportRequests';

const useStyles = makeStyles()((theme) => ({
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
        [theme.breakpoints.down('sm')]: {
            width: '60px',
            height: '60px',
            minHeight: '60px',
        }
    },
    icon: {
        width: '44px',
        height: '44px',
        [theme.breakpoints.down('sm')]: {
            width: '32px',
            height: '32px',
        }
    },
    cameraButton: {
        gap: '5px',
        borderRadius: '30px',
        color: '#FFFFFF',
        fontFamily: '"Heebo", sans-serif',
        fontSize: '18px',
        fontWeight: 600,
        backgroundColor: '#2C2C2C',
        direction: 'rtl',
    },
    dialogPaper: {
        backgroundColor: '#000000',
        color: '#ffffff',
        margin: 0,
        width: '100vw',
        height: '100dvh',
        maxWidth: 'none !important',
        maxHeight: 'none !important',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        direction: 'rtl',
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
        backgroundColor: 'black',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '30px 40px',
        paddingBottom: 'calc(30px + env(safe-area-inset-bottom, 0px))',
        zIndex: 10,
        [theme.breakpoints.down('sm')]: {
            padding: '25px',
            paddingBottom: 'calc(40px + env(safe-area-inset-bottom, 0px))',
        }
    },
    galleryButton: {
        color: '#ffffff',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        [theme.breakpoints.down('sm')]: {
            width: '45px',
            height: '45px',
        }
    },
    placeholder: {
        width: '50px',
        height: '50px',
        [theme.breakpoints.down('sm')]: {
            width: '45px',
            height: '45px',
        }
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
        [theme.breakpoints.down('sm')]: {
            top: 10,
            right: 10,
        }
    },
    errorText: {
        color: 'white',
        backgroundColor: '#ff1744',
        borderRadius: '15px',
        textAlign: 'center',
        fontFamily: '"Heebo", sans-serif',
        padding: 16,
        fontWeight: 600,
    },
    cameraFunctions: {
        backgroundColor: 'red'
    },
    shutterButton: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        border: '3px solid #000000',
        boxShadow: '0 0 0 4px #ffffff',
        cursor: 'pointer',
        transition: 'transform 0.1s ease',
        '&:active': {
            transform: 'scale(0.92)',
        },
        [theme.breakpoints.down('sm')]: {
            width: '56px',
            height: '56px',
        }
    }
}));

interface OpenCameraButtonProps {
    onCapture?: (file: File, previewUrl: string) => void;
    size?: 'small' | 'medium' | 'large';
}

export const OpenCameraButton: React.FC<OpenCameraButtonProps> = ({
    onCapture,
}) => {
    const { classes } = useStyles();
    const { location } = useDeviceLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode] = useState<'user' | 'environment'>('environment');
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

            if (!file.type.startsWith('image/')) {
                alert('נא לבחור קובץ תמונה בלבד');
                event.target.value = '';
                return;
            }

            const previewUrl = URL.createObjectURL(file);

            setCapturedFile(file);
            setCapturedImage(previewUrl);
        }
    };

    const handleRecapture = () => {
        setCapturedImage(null);
        setCapturedFile(null);
    };

    const handleAccept = async (file: File, previewUrl: string) => {
        if (onCapture) {
            onCapture(file, previewUrl);
        }

        try {
            const base64String = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const result = reader.result as string;
                    // Extract just the base64 part, removing the data URL prefix
                    resolve(result.split(',')[1] || result);
                };
                reader.onerror = error => reject(error);
            });

            const now = new Date();
            const timeString = now.toISOString(); // Gets full timestamp (e.g. 2026-06-03T18:28:30.000Z)

            const payload = {
                picture: base64String,
                user_id: (() => {
                    try {
                        return JSON.parse(localStorage.getItem('auth_user') || '{}').id || "unknown";
                    } catch (e) {
                        return "unknown";
                    }
                })(),
                event_id: crypto.randomUUID().substring(0, 8),
                target_location: [location.longitude || 0, location.latitude || 0],
                sent_date: timeString,
            };

            // Send API POST request
            await sendAiPipelineReport(payload);
            console.log('API Request sent successfully', payload);

            // alert('התמונה נשלחה בהצלחה!');
        } catch (err) {
            console.error("Failed to send report", err);
            alert("שגיאה בשליחת הדיווח");
        }

        setIsOpen(false);
        setCapturedImage(null);
        setCapturedFile(null);
    };

    return (
        <>
            <Button
                className={classes.cameraButton}
                onClick={() => setIsOpen(true)}
                aria-label="open camera"
            >
                לצילום מטרה
                <PhotoCameraOutlinedIcon />
            </Button>

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
                        ref={galleryInputRef}
                        onChange={handleGalleryChange}
                        style={{ display: 'none' }}
                        id="gallery-input"
                    />

                    <Box className={classes.controlsContainer}>
                        <Box className={classes.placeholder} />

                        <Box className={classes.shutterButton} onClick={handleCapture} />
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

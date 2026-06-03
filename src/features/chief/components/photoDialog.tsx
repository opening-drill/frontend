import React from 'react';
import { Dialog, Box, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
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
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#000',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptButton: {
        borderRadius: "13px",
        backgroundColor: "#2B7C4E",
        color: "#ffffff",
        width: "35%",
    },
    reCaptureButton: {
        borderRadius: "13px",
        backgroundColor: "#ffffff",
        color: "#000000",
        width: "35%",
    },
    capturedImage: {
        width: '100%',
        height: 'calc(100% - 100px)',
        objectFit: 'contain',
    },
    buttonsContainer: {

    }
}));

interface PhotoDialogProps {
    isOpen: boolean;
    capturedImage: string | null;
    capturedFile: File | null;
    onRecapture: () => void;
    onAccept: (file: File, previewUrl: string) => void;
}

export const PhotoDialog: React.FC<PhotoDialogProps> = ({
    isOpen,
    capturedImage,
    capturedFile,
    onRecapture,
    onAccept,
}) => {
    const { classes } = useStyles();

    const handleAccept = () => {
        if (capturedFile && capturedImage) {
            onAccept(capturedFile, capturedImage);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onRecapture}
            fullScreen
            slotProps={{
                paper: {
                    className: classes.dialogPaper,
                },
            }}
        >
            {capturedImage && (
                <Box className={classes.cameraContainer}>
                    <img src={capturedImage} alt="Preview" className={classes.capturedImage} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', padding: '20px', backgroundColor: '#000' }}>
                        <Button className={classes.reCaptureButton} onClick={onRecapture} sx={{ width: '40%' }}>
                            צילום חוזר
                        </Button>
                        <Button className={classes.acceptButton} onClick={handleAccept} sx={{ width: '40%' }}>
                            אשר מטרה
                        </Button>
                    </Box>
                </Box>
            )}
        </Dialog>
    );
};

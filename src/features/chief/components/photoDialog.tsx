import React from 'react';
import { Dialog, Box, Button, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

const useStyles = makeStyles()((theme) => ({
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
    },
    cameraContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: '#ffffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptButton: {
        borderRadius: "8px",
        backgroundColor: '#2C2C2C',
        color: "#ffffff",
        width: "30%",
        fontFamily: '"Heebo", sans-serif',
        fontWeight: 600,
        gap: '3px',
        [theme.breakpoints.down('sm')]: {
            width: "45%",
            padding: "10px 5px",
        }
    },
    reCaptureButton: {
        borderRadius: "8px",
        border: "3px solid #2C2C2C",
        backgroundColor: "#ffffff",
        color: "#2C2C2C",
        width: "30%",
        fontFamily: '"Heebo", sans-serif',
        fontWeight: 600,
        gap: '3px',
        [theme.breakpoints.down('sm')]: {
            width: "45%",
            padding: "10px 5px",
        }
    },
    capturedImage: {
        maxWidth: 'calc(100% - 32px)',
        maxHeight: 'calc(100% - 132px)',
        width: 'auto',
        height: 'auto',
        margin: '16px',
        objectFit: 'contain',
        borderRadius: '16px',
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        padding: '20px',
        [theme.breakpoints.down('sm')]: {
            padding: '10px',
        }
    },
    subTitle: {
        color: '#646363',
        direction: 'rtl',
        fontFamily: '"Heebo", sans-serif',
        fontSize: '16px',
        fontWeight: 600,
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
                    <Typography className={classes.subTitle}>
                        האם המטרה נראת בבירור ?
                    </Typography>
                    <Box className={classes.buttonsContainer}>
                        <Button className={classes.reCaptureButton} onClick={onRecapture}>
                            צלם מחדש
                            <ReplayOutlinedIcon />
                        </Button>
                        <Button className={classes.acceptButton} onClick={handleAccept}>
                            אשר מטרה
                            <CheckOutlinedIcon />
                        </Button>
                    </Box>
                </Box>
            )}
        </Dialog>
    );
};

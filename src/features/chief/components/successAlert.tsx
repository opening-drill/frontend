import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

export default function SuccessfulAlert() {
    return (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" dir="rtl">
            התמונה נשלחה בהצלחה!
        </Alert>
    );
}

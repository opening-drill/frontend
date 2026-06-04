import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

export default function SuccessfulAlert() {
    return (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            התמונה נשלחה בהצלחה!
        </Alert>
    );
}

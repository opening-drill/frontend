import { useState } from "react";
import styles from "./OpenAlertsList.module.css";
import type { AlertData } from "../../../../types/hamel";
import AttackCard from "../alert-preview/AlertPreview";

interface Props {
  alerts: AlertData[];
  onAccept: (alert: AlertData) => void;
  onDecline: (alert: AlertData) => void;
  onChooseAnother: (alert: AlertData) => void;
}

export default function AttackCardList({
  alerts,
  onAccept,
  onDecline,
  onChooseAnother,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.container}>
      {alerts.map((alert) => (
        <div
          key={alert.event_id}
          onClick={() => handleToggle(alert.event_id)}
        >
          <AttackCard
            alert={alert}
            open={openId === alert.event_id}
            onAccept={onAccept}
            onDecline={onDecline}
            onChooseAnother={onChooseAnother}
          />
        </div>
      ))}
    </div>
  );
}
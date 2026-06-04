import { useState } from "react";
import styles from "./OpenAlertsList.module.css";
import type { AlertData } from "../../../../types/hamel";
import AttackCard from "../alert-preview/AlertPreview";
import { useMap } from "../../../map/MapProvider";

interface Props {
  alerts: AlertData[];
  onAccept: (alert: AlertData) => void;
  onDecline: (alert: AlertData) => void;
  onChooseAnother: (alert: AlertData) => void;
  setAlert: (alert: AlertData) => void;
}

export default function AttackCardList({
  alerts,
  onAccept,
  onDecline,
  onChooseAnother,
  setAlert,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const { goToLocation } = useMap();

  const handleToggle = (alert: AlertData) => {
    goToLocation([alert.target!.longitude, alert.target!.latitude])
    setOpenId((prev) => (prev === alert.event_id ? null : alert.event_id!));
  };

  return (
      <div className={styles.container}>
        {alerts.map((alert) => (
          <div
            key={alert.event_id}
            onClick={() => handleToggle(alert)}>
            <AttackCard
              alert={alert}
              open={openId === alert.event_id}
              onAccept={onAccept}
              onDecline={onDecline}
              onChooseAnother={onChooseAnother}
              setAlert={setAlert}
            />
          </div>
        ))}
      </div>
  );
}
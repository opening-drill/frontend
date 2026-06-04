import type { AlertData } from "../../../../types/alertTypes";
import styles from "./AlertPreview.module.css";

interface AttackCardProps {
  alert: AlertData;
  open: boolean;
  onAccept: (alert: AlertData) => void;
  onDecline: (alert: AlertData) => void;
  onChooseAnother: (alert: AlertData) => void;
  setAlert: (alert: AlertData) => void;
}

export default function AttackCard({
  alert,
  open,
  onAccept,
  onDecline,
  onChooseAnother,
  setAlert,
}: AttackCardProps) {
  if (!open) {
    return (
      <div className={`${styles.card} ${styles.closed}`}>
        <span className={styles.time}>
          {new Date(alert.received_alert_time).toLocaleTimeString()}
        </span>

        <span className={styles.summary}>
          Detected {alert.target.name ?? "Target"} • Launch{" "}
          {alert.aircraft_type}
        </span>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4>{alert.target.name ?? "Unknown Target"}</h4>

        <span className={styles.time}>
          {new Date(alert.received_alert_time).toLocaleTimeString()}
        </span>
      </div>

      <img
        src={alert.image_url}
        alt={alert.target.name ?? "Target"}
        className={styles.image}
      />

      <div className={styles.details}>
        <div>
          <span className={styles.label}>Aircraft:</span>
          <span>{alert.aircraft_type}</span>
        </div>

        <div>
          <span className={styles.label}>Coordinates:</span>
          <span>
              {alert.target.lat.toFixed(4)}, {alert.target.lng.toFixed(4)}
          </span>
        </div>

        <div>
          <span className={styles.label}>Urgency:</span>
          <span
            className={`${styles.badge} ${
              styles[`urgency_${alert.urgency_level}`]
            }`}
          >
            {alert.urgency_level}
          </span>
        </div>

        {alert.rationale && (
          <div className={styles.rationale}>
            {alert.rationale}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.acceptBtn}
          onClick={() => onAccept(alert)}
        >
          Accept
        </button>

        <button
          className={styles.declineBtn}
          onClick={() => onDecline(alert)}
        >
          Decline
        </button>

        <button
          className={styles.changeBtn}
          onClick={() => {setAlert(alert); onChooseAnother(alert)}}
        >
          Change Aircraft
        </button>
      </div>
    </div>
  );
}
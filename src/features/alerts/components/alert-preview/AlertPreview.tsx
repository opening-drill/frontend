import type { MouseEvent } from "react";
import type { RecommendationPush } from "../../../../types/hamel";
import styles from "./AlertPreview.module.css";

type AlertPreviewData = RecommendationPush & {
  received_alert_time?: string;
};

interface AttackCardProps {
  alert: AlertPreviewData;
  open: boolean;
  onAccept: (alert: RecommendationPush) => void;
  onDecline: (alert: RecommendationPush) => void;
  onChooseAnother: (alert: RecommendationPush) => void;
  setAlert: (alert: RecommendationPush) => void;
}

export default function AttackCard({
  alert,
  open,
  onAccept,
  onDecline,
  onChooseAnother,
  setAlert,
}: AttackCardProps) {
  const receivedTime = alert.received_alert_time
    ? new Date(alert.received_alert_time).toLocaleTimeString()
    : "";
  const stopCardToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  if (!open) {
    return (
      <div className={`${styles.card} ${styles.closed}`}>
        {receivedTime && <span className={styles.time}>{receivedTime}</span>}

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

        {receivedTime && <span className={styles.time}>{receivedTime}</span>}
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
          onClick={(event) => {
            stopCardToggle(event);
            onAccept(alert);
          }}
        >
          Accept
        </button>

        <button
          className={styles.declineBtn}
          onClick={(event) => {
            stopCardToggle(event);
            onDecline(alert);
          }}
        >
          Decline
        </button>

        <button
          className={styles.changeBtn}
          onClick={(event) => {
            stopCardToggle(event);
            setAlert(alert);
            onChooseAnother(alert);
          }}
        >
          Change Aircraft
        </button>
      </div>
    </div>
  );
}

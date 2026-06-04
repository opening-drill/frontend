import styles from "./OpenAlertsList.module.css";
import AttackCard from "../alert-preview/AlertPreview";
import type { RecommendationPush } from "../../../../types/hamel";
import { activeIdAtom } from "../../../../store/recommendationAtoms";
import { useAtom } from "jotai";

interface Props {
  alerts: RecommendationPush[];
  onAccept: (alert: RecommendationPush) => void;
  onDecline: (alert: RecommendationPush) => void;
  onChooseAnother: (alert: RecommendationPush) => void;
  setAlert: (alert: RecommendationPush) => void;
}

export default function AttackCardList({
  alerts,
  onAccept,
  onDecline,
  onChooseAnother,
  setAlert,
}: Props) {
  const [openId, setOpenId] = useAtom(activeIdAtom);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
      <div className={styles.container}>
        {alerts.map((alert) => (
          <div
            key={alert.event_id}
            onClick={() => handleToggle(alert.event_id)}>
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

import axios from 'axios';

export interface ReportPayload {
  picture: string;
  event_id: string;
  target_location: number[];
  sent_date: string;
}

/**
 * Sends the captured image report to the AI Pipeline service.
 * @param payload The report data containing the picture base64, event id, location, and timestamp
 */
export async function sendAiPipelineReport(payload: ReportPayload): Promise<void> {
  const url = 'https://live-data-1015949672422.europe-west1.run.app/api/ai-pipeline/report';
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const rawToken = localStorage.getItem('auth_token');
    if (rawToken) {
      const token = JSON.parse(rawToken);
      if (token && typeof token === 'string') {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Error parsing auth token for report request:', error);
  }

  await axios.post(url, payload, { headers });
}

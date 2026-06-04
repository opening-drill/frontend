import { io, type Socket } from 'socket.io-client';
import type { RecommendationPush } from '../../types/hamel';
import type {
  Snapshot,
  AircraftBatch,
  Zone,
  DispatchLive,
  GeoViolationPush,
} from '../../types/aircraft';

const LIVE_NAMESPACE = '/live';

export interface ServerToClientEvents {
  'recommendation:new': (recommendation: RecommendationPush) => void;
  'event:update': (event: unknown) => void;
  'snapshot': (snapshot: Snapshot) => void;
  'aircraft:batch': (batch: AircraftBatch) => void;
  'dispatch:update': (dispatch: DispatchLive) => void;
  'zone:add': (zone: Zone) => void;
  'zone:remove': (payload: { zone_id: string }) => void;
  'geo:violation': (payload: GeoViolationPush) => void;
}

export interface ClientToServerEvents {
  'alert:ack': (payload: { event_id: string }) => void;
}

export type LiveSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Reads the auth token from localStorage.
 * Jotai's atomWithStorage serializes values as JSON, so the raw
 * stored value is a JSON-encoded string (e.g. `"\"eyJ...\""`).
 * We JSON.parse it to get the plain JWT string.
 */
const getAuthToken = (): string | null => {
  try {
    const raw = localStorage.getItem('auth_token');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed === 'string' ? parsed : null;
  } catch {
    return null;
  }
};

const getSocketBaseUrl = (): string => {
  const url =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL ||
    '';
  return url.replace(/\/+$/, '');
};

// ─── Singleton socket ─────────────────────────────────────────────────────────
let _socket: LiveSocket | null = null;
let _refCount = 0;

const getOrCreateSocket = (): LiveSocket => {
  if (!_socket) {
    _socket = io(`${getSocketBaseUrl()}${LIVE_NAMESPACE}`, {
      auth: { token: getAuthToken() },
      autoConnect: false,
      transports: ['websocket'],
    });
  }
  return _socket;
};

/**
 * Call once per hook/component that wants to use the live socket.
 * Increments the reference count; actually connects on first call.
 */
export const initializeLiveSocket = (): LiveSocket => {
  const sock = getOrCreateSocket();

  // Refresh auth token every time a new consumer connects
  sock.auth = { token: getAuthToken() };

  _refCount++;
  if (!sock.connected) {
    sock.connect();
  }

  return sock;
};

/**
 * Call in the cleanup of every hook/component that called initializeLiveSocket.
 * Only physically disconnects when the last consumer releases the socket.
 */
export const disconnectLiveSocket = (): void => {
  _refCount = Math.max(0, _refCount - 1);
  if (_refCount === 0 && _socket) {
    _socket.disconnect();
    _socket = null;
  }
};

/** Direct access to the current singleton (may be null if not initialised). */
export const socket: LiveSocket = getOrCreateSocket();

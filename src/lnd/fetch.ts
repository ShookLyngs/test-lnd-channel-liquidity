import 'dotenv/config.js';
import process from 'node:process';
import { Channel, LndError, GraphRoutes } from './interface.js';

export function parseEnv() {
  const lndUrl = process.env.LND_URL;
  const macaroon = process.env.MACAROON;
  if (!lndUrl || !macaroon) {
    throw new Error('Missing LND_URL or MACAROON in environment variables');
  }

  return {
    lndUrl,
    macaroon,
  };
}

export async function fetchLnd<T>(path: string, fetchOptions?: RequestInit) {
  const env = parseEnv();
  const res = await fetch(`${env.lndUrl}/${path}`, {
    method: 'GET',
    ...fetchOptions,
    headers: new Headers({
      'Grpc-Metadata-macaroon': env.macaroon,
    }),
  });

  const json = await res.json();
  if (isLndError(json)) {
    throw json;
  }

  return json as T;
}

export function isLndError(res: unknown): res is LndError {
  return (res as LndError).code !== undefined && (res as LndError).message !== undefined;
}

export async function getGraphRoutes(remotePubkey: string, amount: number) {
  return fetchLnd<GraphRoutes>(`v1/graph/routes/${remotePubkey}/${amount}`);
}

export async function getChannels() {
  const { channels } = await fetchLnd<{ channels: Channel[] }>('v1/channels');
  return channels;
}

export async function getChannelById(channelId: string): Promise<Channel | undefined> {
  const channels = await getChannels();
  return channels.find((channel) => channel.chan_id === channelId);
}

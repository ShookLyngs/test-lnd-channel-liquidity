import { getGraphRoutes } from '../lnd/fetch.js';

export async function getLocalSpendableByBinarySearch(
  remotePubkey: string,
  targetChannelId: string,
  localBalance: number,
): Promise<number> {
  let min = 1;
  let max = localBalance;
  let result = 0;

  while (min <= max) {
    const mid = Math.floor((min + max) / 2);
    let matched = false;
    try {
      const res = await getGraphRoutes(remotePubkey, mid);
      const matchRoutes = res.routes.filter((route) => {
        return route.hops.length === 1 && route.hops[0].chan_id === targetChannelId;
      });
      matched = matchRoutes.length > 0;
    } catch (e) {
      console.warn(`queryRoutes failed: ${JSON.stringify(e)}`);
    }
    if (matched) {
      result = mid;
      min = mid + 1;
    } else {
      max = mid - 1;
    }
  }

  return result;
}

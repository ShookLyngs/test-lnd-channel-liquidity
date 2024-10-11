import { queryRoutes } from './lnd/fetch.js';

async function getLocalSpendableByBinarySearch(remotePubkey: string, targetChannelId: string) {
  let min = 1;
  let max = 93433;
  let result = 0;

  while (min <= max) {
    const mid = Math.floor((min + max) / 2);
    let matched = false;
    try {
      const res = await queryRoutes(remotePubkey, mid);
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

async function main() {
  // Your target channel id
  const channelId = '3190379223087841281';
  // Your target remote node pubkey
  const remotePubkey = '02ab97a479a2aeebb3606e74a001d2822d513c2b6e9f387525a44050b345eed877';

  const localCapacity = await getLocalSpendableByBinarySearch(remotePubkey, channelId);
  console.log(`local capacity: ${localCapacity}`);
}

main().catch((e) => {
  console.error('main process failed:', e);
  process.exit(1);
});

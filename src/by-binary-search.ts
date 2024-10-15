import { getChannelById } from './lnd/fetch.js';
import { getLocalSpendableByBinarySearch } from './methods/binary-search.js';

// Fill your target channel id
const CHANNEL_ID = '3190379223087841281';

async function main() {

  const channel = await getChannelById(CHANNEL_ID);
  if (!channel) {
    console.error('cannot find channel by id:', CHANNEL_ID);
    return;
  }

  const localCapacity = await getLocalSpendableByBinarySearch(channel.remote_pubkey, CHANNEL_ID, Number(channel.local_balance));
  console.log(`local's outbound (spendable balance) is: ${localCapacity}`);
  console.log('this is also the inbound for the remote peer');
}

main().catch((e) => {
  console.error('main process failed:', e);
  process.exit(1);
});

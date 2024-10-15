import { getChannelById } from './lnd/fetch.js';
import { calculateChannelLiquidityByChannelState } from './methods/channel-summary.js';

// Your target channel id
const CHANNEL_ID = '3190379223087841281';

async function main() {

  const channel = await getChannelById(CHANNEL_ID);
  if (!channel) {
    throw new Error(`cannot find channel by id: ${CHANNEL_ID}`);
  }

  const liquidity = calculateChannelLiquidityByChannelState(channel);
  console.log(JSON.stringify(liquidity, null, 2));
  console.log('---');
  console.log(`summary:`);
  console.log(`channel ${channel.chan_id} has capacity of: ${liquidity.capacity}`);
  console.log(`sats occupied by various outputs: ${liquidity.outputsReserve}, balance reserved for penalty: ${liquidity.balanceReserve}`);
  console.log(`local's outbound (spendable balance): ${liquidity.local.spendable}, inbound (receivable balance): ${liquidity.remote.spendable}, reserve: ${liquidity.local.reserve}`);
  console.log(`remote's outbound (spendable balance): ${liquidity.remote.spendable}, inbound (receivable balance): ${liquidity.local.spendable}, reserve: ${liquidity.remote.reserve}`);
  console.log(`remote's public key: ${channel.remote_pubkey}`);
}

main().catch((e) => {
  console.error('main process failed:', e);
  process.exit(1);
});

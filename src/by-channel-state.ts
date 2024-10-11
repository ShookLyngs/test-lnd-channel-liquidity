import { Channel } from './lnd/interface.js';
import { getChannelById } from './lnd/fetch.js';
import process from "node:process";

function calculateChannelLiquidity(channel: Channel) {
  console.log(process.execArgv);
  const isLocalFunder = channel.initiator;

  const funderReserve = Number(isLocalFunder ? channel.local_chan_reserve_sat : channel.remote_chan_reserve_sat);
  const funderBalance = Number(isLocalFunder ? channel.local_balance : channel.remote_balance);
  const funderSpendable = Number(funderBalance) - Number(funderReserve);
  const funderLiquidity = {
    reserve: funderReserve,
    balance: funderBalance,
    spendable: funderSpendable,
  };

  const receiverReserve = Number(isLocalFunder ? channel.remote_chan_reserve_sat : channel.local_chan_reserve_sat);
  const receiverBalance = Number(isLocalFunder ? channel.remote_balance : channel.local_balance);
  const receiverSpendable = Number(receiverBalance) - Number(receiverReserve);
  const receiverLiquidity = {
    reserve: receiverReserve,
    balance: receiverBalance,
    spendable: receiverSpendable,
  };

  const capacity = Number(channel.capacity);
  const totalReserve = capacity - (funderSpendable + receiverSpendable);
  const balancesReserve = funderReserve + receiverReserve;
  const allowAnchors = channel.commitment_type === 'ANCHORS';
  const anchorsReserve = allowAnchors ? (funderBalance > 0 ? 330 : 0) + (receiverBalance > 0 ? 330 : 0) : 0;
  const htlcsReserve = channel.pending_htlcs.reduce((sum, htlc) => sum + Number(htlc.amount), 0);

  return {
    capacity,
    reserve: {
      total: totalReserve,
      htlcs: htlcsReserve,
      anchors: anchorsReserve,
      balances: balancesReserve,
      fee: Number(channel.commit_fee),
    },
    local: isLocalFunder ? funderLiquidity : receiverLiquidity,
    remote: isLocalFunder ? receiverLiquidity : funderLiquidity,
  };
}

async function main() {
  // Your target channel id
  const channelId = '3190379223087841281';

  const channel = await getChannelById(channelId);
  if (!channel) {
    console.log('cannot find channel by id:', channelId);
    return;
  }

  const liquidity = calculateChannelLiquidity(channel!);
  console.log(JSON.stringify(liquidity, null, 2));
}

main().catch((e) => {
  console.error('main process failed:', e);
  process.exit(1);
});

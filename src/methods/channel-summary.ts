import { SimplifiedChannel } from '../lnd/interface.js';

export interface ChannelLiquidity {
  capacity: number;
  totalReserve: number;
  balanceReserve: number;
  outputsReserve: number;
  reserves: {
    fee: number;
    htlcs: number;
    anchors: number;
  };
  local: {
    reserve: number;
    balance: number;
    spendable: number;
  };
  remote: {
    reserve: number;
    balance: number;
    spendable: number;
  };
}

export function calculateChannelLiquidityByChannelState(channel: SimplifiedChannel): ChannelLiquidity {
  const isLocalFunder = channel.initiator;

  // Funder balance
  const funderDustLimit = Number(isLocalFunder ? channel.local_constraints.dust_limit_sat : channel.remote_constraints.dust_limit_sat);
  const funderReserve = Number(isLocalFunder ? channel.local_constraints.chan_reserve_sat : channel.remote_constraints.chan_reserve_sat);
  const funderBalance = Number(isLocalFunder ? channel.local_balance : channel.remote_balance);
  const funderSpendable = funderBalance - funderReserve;
  const funderLiquidity = {
    reserve: funderReserve,
    balance: funderBalance,
    spendable: funderSpendable,
  };

  // Receiver balance
  const receiverDustLimit = Number(isLocalFunder ? channel.remote_constraints.dust_limit_sat : channel.local_constraints.dust_limit_sat);
  const receiverReserve = Number(isLocalFunder ? channel.remote_constraints.chan_reserve_sat : channel.local_constraints.chan_reserve_sat);
  const receiverBalance = Number(isLocalFunder ? channel.remote_balance : channel.local_balance);
  const receiverSpendable = receiverBalance - receiverReserve;
  const receiverLiquidity = {
    reserve: receiverReserve,
    balance: receiverBalance,
    spendable: receiverSpendable,
  };

  // Total reserve
  const capacity = Number(channel.capacity);
  const balanceReserve = funderReserve + receiverReserve;
  const outputsReserve = capacity - funderBalance - receiverBalance;
  const totalReserve = capacity - funderSpendable - receiverSpendable;

  // Reserve by outputs
  const allowAnchors = channel.commitment_type === 'ANCHORS';
  const hasFunderAnchor = funderBalance >= funderDustLimit;
  const hasReceiverAnchor = receiverBalance >= receiverDustLimit;
  const anchorsReserve = allowAnchors ? (hasFunderAnchor ? 330 : 0) + (hasReceiverAnchor ? 330 : 0) : 0;
  const htlcsReserve = channel.pending_htlcs.reduce((sum, htlc) => sum + Number(htlc.amount), 0);

  return {
    capacity,
    totalReserve,
    balanceReserve,
    outputsReserve,
    reserves: {
      fee: Number(channel.commit_fee),
      htlcs: htlcsReserve,
      anchors: anchorsReserve,
    },
    local: isLocalFunder ? funderLiquidity : receiverLiquidity,
    remote: isLocalFunder ? receiverLiquidity : funderLiquidity,
  };
}

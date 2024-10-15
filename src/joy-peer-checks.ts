import { calculateChannelLiquidityByChannelState } from './methods/channel-summary.js';


function main() {
  /*const joyHubChannel = {
    "active": true,
    "remote_pubkey": "02d2234f08c2f45cd0b9b3aee57dfdb0fbbf50c556973728c3f54f344da6fa52c8",
    "channel_point": "903af91b99a64f75f0ece09a16861577f395372c7958568f5232b7b6f3f68937:0",
    "chan_id": "17592186044416000059",
    "capacity": 20000,
    "local_balance": 1573,
    "remote_balance": 2530,
    "commit_fee": 15237,
    "commit_weight": 1116,
    "fee_per_kw": 13556,
    "total_satoshis_sent": 1520,
    "total_satoshis_received": 169,
    "num_updates": 67,
    "csv_delay": 288,
    "private": true,
    "initiator": true,
    "chan_status_flags": "ChanStatusDefault",
    "local_chan_reserve_sat": 1000,
    "remote_chan_reserve_sat": 354,
    "commitment_type": "ANCHORS",
    "lifetime": 20988,
    "uptime": 13059,
    "push_amount_sat": 1180,
    "local_constraints": {
      "csv_delay": 288,
      "chan_reserve_sat": 1000,
      "dust_limit_sat": 354,
      "max_pending_amt_msat": 20000000,
      "min_htlc_msat": 1,
      "max_accepted_htlcs": 50
    },
    "remote_constraints": {
      "csv_delay": 144,
      "chan_reserve_sat": 354,
      "dust_limit_sat": 354,
      "max_pending_amt_msat": 19800000,
      "min_htlc_msat": 1,
      "max_accepted_htlcs": 483
    },
    "alias_scids": [17592186044416000059],
    "zero_conf": true,
    "zero_conf_confirmed_scid": 3307263906354823168,
    "peer_scid_alias": 3132229351702528002,
    "memo": "JoyID channel"
  };
  const joyClientChannel = {
    "user_chan_id": "890764df9b16f78352589d0355e04a19",
    "balance": 353,
    "size": 20000,
    "reserve": 3178,
    "inbound": 16469,
    "outpoint": "903af91b99a64f75f0ece09a16861577f395372c7958568f5232b7b6f3f68937:0",
    "peer": "03d2fc638243a9bdaf4a4244510c73e5af874e6fcf99deb3d532019ba3e3f57e4d",
    "confirmations_required": 0,
    "confirmations": 127581,
    "is_outbound": false,
    "is_usable": true,
    "is_anchor": true
  };*/
  const joyHubChannel = {"active":true,"remote_pubkey":"02d2234f08c2f45cd0b9b3aee57dfdb0fbbf50c556973728c3f54f344da6fa52c8","channel_point":"903af91b99a64f75f0ece09a16861577f395372c7958568f5232b7b6f3f68937:0","chan_id":"17592186044416000059","capacity":20000,"local_balance":13999,"remote_balance":2530,"commit_fee":2811,"commit_weight":1116,"fee_per_kw":2500,"total_satoshis_sent":1520,"total_satoshis_received":169,"num_updates":68,"csv_delay":288,"private":true,"initiator":true,"chan_status_flags":"ChanStatusDefault","local_chan_reserve_sat":1000,"remote_chan_reserve_sat":354,"commitment_type":"ANCHORS","lifetime":64537,"uptime":56608,"push_amount_sat":1180,"local_constraints":{"csv_delay":288,"chan_reserve_sat":1000,"dust_limit_sat":354,"max_pending_amt_msat":20000000,"min_htlc_msat":1,"max_accepted_htlcs":50},"remote_constraints":{"csv_delay":144,"chan_reserve_sat":354,"dust_limit_sat":354,"max_pending_amt_msat":19800000,"min_htlc_msat":1,"max_accepted_htlcs":483},"alias_scids":[17592186044416000059],"zero_conf":true,"zero_conf_confirmed_scid":3307263906354823168,"peer_scid_alias":3132229351702528002,"memo":"JoyID channel"};
  const joyClientChannel = {
    "user_chan_id": "890764df9b16f78352589d0355e04a19",
    "balance": 2176,
    "size": 20000,
    "reserve": 1355,
    "inbound": 16469,
    "outpoint": "903af91b99a64f75f0ece09a16861577f395372c7958568f5232b7b6f3f68937:0",
    "peer": "03d2fc638243a9bdaf4a4244510c73e5af874e6fcf99deb3d532019ba3e3f57e4d",
    "confirmations_required": 0,
    "confirmations": 162006,
    "is_outbound": false,
    "is_usable": true,
    "is_anchor": true
  };

  const liquidity = calculateChannelLiquidityByChannelState({
    ...joyHubChannel as any,
    pending_htlcs: [],
  });
  console.log(JSON.stringify(liquidity, null, 2));

  if (joyClientChannel.outpoint !== joyHubChannel.channel_point) {
    console.error(`channel point mismatch, hub: ${joyHubChannel.channel_point}, client: ${joyClientChannel.outpoint}`);
  }
  if (joyHubChannel.capacity !== liquidity.capacity) {
    console.error(`channel capacity mismatch, hub: ${joyHubChannel.capacity}, client: ${joyClientChannel.size}`);
  }
  if (joyClientChannel.reserve !== liquidity.balanceReserve) {
    console.error(`channel balance reserve mismatch, client: ${joyClientChannel.reserve}, hub: ${liquidity.balanceReserve}`);
  }
  if (joyClientChannel.balance !== liquidity.remote.spendable) {
    console.error(`client outbound mismatch, client: ${joyClientChannel.balance}, hub: ${liquidity.remote.spendable}`);
  }
  const expectClientInbound = liquidity.capacity - liquidity.balanceReserve - liquidity.remote.spendable;
  if (joyClientChannel.inbound !== expectClientInbound) {
    console.error(`client inbound mismatch, client: ${joyClientChannel.inbound}, hub: ${expectClientInbound}`);
  }
}

main();

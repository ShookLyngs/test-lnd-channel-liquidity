export interface LndError {
  code: number;
  message: string;
}

export interface QueryRoutes {
  routes: {
    total_time_lock: number;
    total_fees: string;
    total_amt: string;
    total_fees_msat: string;
    total_amt_msat: string;
    hops: {
      chan_id: string;
      chan_capacity: string;
      amt_to_forward: string;
      fee: string;
      expiry: number;
      amt_to_forward_msat: string;
      fee_msat: string;
      pub_key: string;
      tlv_payload: boolean;
      total_amt_msat: string;
    }[];
  }[];
  success_prob: number;
}

export interface Channel {
  active: boolean;
  remote_pubkey: string;
  channel_point: string;
  chan_id: string;
  capacity: string;
  local_balance: string;
  remote_balance: string;
  commit_fee: string;
  commit_weight: string;
  fee_per_kw: string;
  unsettled_balance: string;
  total_satoshis_sent: string;
  total_satoshis_received: string;
  num_updates: string;
  pending_htlcs: PendingHtlc[];
  csv_delay: number;
  private: boolean;
  initiator: boolean;
  chan_status_flags: string;
  local_chan_reserve_sat: string;
  remote_chan_reserve_sat: string;
  static_remote_key: boolean;
  commitment_type: "ANCHORS" | string;
  lifetime: string;
  uptime: string;
  close_address: string;
  push_amount_sat: string;
  thaw_height: number;
  local_constraints: ChannelConstraints;
  remote_constraints: ChannelConstraints;
  alias_scids: [];
  zero_conf: boolean;
  zero_conf_confirmed_scid: string;
  peer_alias: string;
  peer_scid_alias: string;
  memo: string;
}

export interface PendingHtlc {
  incoming: boolean;
  amount: string;
  hash_lock: string;
  expiration_height: number;
  htlc_index: string;
  forwarding_channel: string;
  forwarding_htlc_index: string;
}

export interface ChannelConstraints {
  csv_delay: number;
  chan_reserve_sat: string;
  dust_limit_sat: string;
  max_pending_amt_msat: string;
  min_htlc_msat: string;
  max_accepted_htlcs: number;
}

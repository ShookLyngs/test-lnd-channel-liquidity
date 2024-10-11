# Test: LN channel liquidity

This repository is a test project for comparing the methods of calculating the channel capacity/liquidity in the Lightning Network, using LND but through different APIs:

- `v1/graph/routes/{pubkey}/{amount}`: Get local balance with binary search, by finding the maximum amount that can be sent to a node in a `while()` loop. This function can test the actual spendable balance of the local node, but it doesn't work for inactive channels.
- `/v1/channels`: Get channel state and calculate liquidity info, e.g. actual spendable balance for local/remote, because part of the node balance is reserved and not spendable. This method also calculates the details in channel reserves. 

## Setup

### Install dependencies

```bash
pnpm install
```

### Create `.env` file

Create a `.env` file in the root directory of the project with the following environment variables:

```dotenv
LND_URL=<your_lnd_rest_url>
MACAROON=<your_lnd_macaroon>
```

## Run scripts

### Calculate by binary search

You can edit the `channelId` and `remotePubkey` in [src/by-binary-search.ts](./src/by-binary-search.ts) and run script:

```bash
pnpm run by-bynary-search
```

Example output:
```
local capacity: 92433
```

### Calculate by channel state

You can edit the `channelId` in [src/by-channel-state.ts](./src/by-channel-state.ts) and run script:

```bash
pnpm run by-channel-state
```

Example output:
```
{
  "capacity": 100000,
  "reserve": {
    "total": 2944,
    "htlcs": 0,
    "anchors": 660,
    "balances": 2000,
    "fee": 284
  },
  "local": {
    "reserve": 1000,
    "balance": 93433,
    "spendable": 92433
  },
  "remote": {
    "reserve": 1000,
    "balance": 5623,
    "spendable": 4623
  }
}
```

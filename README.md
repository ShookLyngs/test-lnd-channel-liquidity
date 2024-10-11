# Test: LN channel liquidity

This repository is a test project for comparing the methods of calculating the channel capacity/liquidity in the Lightning Network, using LND but through different APIs:

- `v1/graph/routes/{pubkey}/{amount}`: Get local balance with binary search, by finding the maximum amount that can be sent to a node in a while() loop.
- `/v1/channels`: Get channel state and calculate liquidity info, e.g. actual spendable satoshis for local and remote, because part of the node balance is reserved and not spendable.

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

Run script to calculate local spendable with binary search:

```bash
pnpm run by-bynary-search
```

Example output:
```
local capacity: 92433
```

### Calculate by channel state

Run script to calculate local/remote spendable with channel state:

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

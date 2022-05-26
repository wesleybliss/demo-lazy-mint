# Lazy Mint Demo API

## Setup

```shell
# Install dependencies
$ yarn

# Create an env file
$ cp .env.sample .env

# Start Ganache (or similar local testnet)
# Populate the .env values (at least WEB3_PORT and WEB3_SIGNER_PRIVATE_KEY are required)
```

## Running

```shell
# Start Ganache first
# Deploy the contract (`yarn deploy` within the contract directory)

# Start the API server
$ yarn dev
```

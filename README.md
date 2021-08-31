# PrimDev Certificate

> ✨ Ethereum fullstack project based on Hardhat and Snowpack

## Table of contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Development](#development)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

## Prerequisites

- NodeJs (>= 14.17.0)
- NPM (>= 7.18.0)

## Setup

1. Install all packages :

```bash
npm install
```

2. Because this project uses Firebase, you need to [config Firebase](https://firebase.google.com/docs/web/setup) first. Copy firebase config example and fill it with your configuration :

```bash
cp src/firebase-config.example.json src/firebase-config.json
```

## Development

If you want to run this project on your development machine, here's how:

1. Run Hardhat network first :

```bash
npx hardhat node
```

2. On other terminal, deploy smart contract on the network :

```bash
npx hardhat run smart-contract/scripts/deploy.ts --network localhost
```

3. Create `.env` based on `.env.example` :

```bash
cp .env.example .env
```

4. Change SNOWPACK_PUBLIC_CONTRACT_ADDRESS_LOCAL on `.env` based on address returned by the deploy script.

5. Run the Web App. Make sure the Hardhat network still running. In conclusion, you need two terminals to run this project. One for Hardhat network, and one for the Web App :

```bash
npm start
```

## Available Scripts

### Web App Scripts

#### `npm start`

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm run build`

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

#### `npm test`

Launches the application test runner.
Run with the `--watch` flag (`npm test -- --watch`) to run in interactive watch mode.

### Smart Contract Scripts

#### `npm run contract:compile`

Compile smart contracts, so they can be used on the web app and smart contract test.

#### `npm run contract:test`

Run test for smart contracts. Make sure `contract-types` folder exists on the project root. If it doesn't exist. Run `npm run contract:compile`.

#### `npm run contract:clean`

Remove all files related to the compile result of smart contracts.

## Deployment

### Web App

If you're using services like Vercel or Netlify. Just use the default configuration for React. Production build command is `npm run build` and the directory is `build`.

If you hosted it yourself. Just run `npm run build` and upload the `build` folder.

### Smart Contract

Here's how to deploy the smart contract. Make sure to change the NETWORK based on your network to deploy, eg. `ropsten`, `localhost`.

```bash
npx hardhat run smart-contract/scripts/deploy.ts --network NETWORK
```

This project uses Ropsten as the test network. So if you like to try using Ropsten too, here's how:

1. Change DEPLOYER_PRIVATE_KEY on `.env` with your account private key.
2. You can use [Infura](https://infura.io) to create an Ethereum node. Infura Ethereum node already includes the Ropsten network.
3. After creating an Ethereum node on Infura, go to `Settings`, change the `ENDPOINTS` selection from `Mainnet` to `Ropsten`. Copy the HTTP URL, that's your Ropsten RPC URL. The URL should look like this: `https://ropsten.infura.io/v3/12345abcde`. You can see that it starts with `ropsten` on the subdomain.
4. Change ROPSTEN_RPC_URL on `.env` with your Ropsten RPC URL.
5. Run the deploy script with `ropsten` as the network. Change SNOWPACK_PUBLIC_CONTRACT_ADDRESS_ROPSTEN on `.env` based on address returned by the deploy script.

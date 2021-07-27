# PrimDev Certificate

> ✨ Ethereum fullstack project based on Hardhat and Snowpack

## Table of contents

- [Setup](#setup)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

## Setup

1. Install all packages :

```bash
npm install
```

2. Create `.env` based on `.env.example` :

```bash
cp .env.example .env
```

3. Compile Smart Contracts :

```bash
npm run contract:compile
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

Run `npx ts-node smart-contract/scripts/deploy.ts`. Make sure

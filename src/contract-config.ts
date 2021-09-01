import { ethers } from 'ethers';

interface ContractConfig {
  [key: number]: {
    address?: string;
    blockExplorerUrl?: string;
  };
}

const contractConfig: ContractConfig = {
  3: {
    address: import.meta.env.SNOWPACK_PUBLIC_CONTRACT_ADDRESS_ROPSTEN,
    blockExplorerUrl: 'https://ropsten.etherscan.io',
  },
  1337: {
    address: import.meta.env.SNOWPACK_PUBLIC_CONTRACT_ADDRESS_LOCAL,
  },
};

export function getContractConfig(
  provider: ethers.providers.Web3Provider | null,
) {
  if (!provider?.network?.chainId) return null;
  return contractConfig[provider.network.chainId];
}

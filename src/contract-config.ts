interface ContractConfig {
  [key: number]: {
    address: string;
    blockExplorerUrl: string | null;
  };
}

export const contractConfig: ContractConfig = {
  3: {
    address: import.meta.env.SNOWPACK_PUBLIC_CONTRACT_ADDRESS_ROPSTEN,
    blockExplorerUrl: 'https://ropsten.etherscan.io',
  },
  1337: {
    address: import.meta.env.SNOWPACK_PUBLIC_CONTRACT_ADDRESS_LOCAL,
    blockExplorerUrl: null,
  },
};

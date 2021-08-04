import detectEthereumProvider from '@metamask/detect-provider';
import { useEffect, useState, useCallback } from 'react';
import type {
  ProviderMessage,
  ProviderRpcError,
  ProviderConnectInfo,
  RequestArguments,
} from 'hardhat/types';
import { ethers } from 'ethers';

interface EthereumEvent {
  connect: ProviderConnectInfo;
  disconnect: ProviderRpcError;
  accountsChanged: Array<string>;
  chainChanged: string;
  message: ProviderMessage;
}

type EventKeys = keyof EthereumEvent;
type EventHandler<K extends EventKeys> = (event: EthereumEvent[K]) => void;

/**
 * Ref: https://stackoverflow.com/a/67665205
 * If you need other methods from NodeJS.EventEmitter to enable the EthereumEvent typing, just add it here
 * It's recommended to only implement methods that we need to use
 * Experimental API and Legacy API are not included here
 */
interface Ethereumish extends NodeJS.EventEmitter {
  readonly isMetaMask: boolean;
  isConnected: () => boolean;
  on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): this;
  request: (request: RequestArguments) => Promise<unknown>;
}

interface ErrorState {
  code: 'notInstalled' | 'multipleWallets' | 'notConnected' | 'unexpectedError';
  message: string;
}

type MetaMaskFeature = 'readOnly' | 'readWrite';

export function useMetaMask(feature: MetaMaskFeature) {
  const [error, setError] = useState<ErrorState | null>(null);

  const [ethereum, setEthereum] = useState<Ethereumish>();
  const provider = ethereum && new ethers.providers.Web3Provider(ethereum);

  useEffect(() => {
    detectEthereumProvider().then((ethereumProvider) => {
      if (!ethereumProvider) {
        setError({ code: 'notInstalled', message: 'Please install MetaMask!' });
      } else if (ethereumProvider !== window.ethereum) {
        setError({
          code: 'multipleWallets',
          message: 'It might be multiple wallets installed',
        });
      } else {
        setError(null);
        setEthereum(ethereumProvider as Ethereumish);
      }
    });
  }, []);

  const [account, setAccount] = useState<string | null>(null);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      setError({
        code: 'notConnected',
        message:
          "You're not connected to any accounts or your MetaMask is locked",
      });
    } else {
      setError(null);
      setAccount(accounts[0]);
    }
  }, []);

  useEffect(() => {
    if (!ethereum) return;

    ethereum.on('chainChanged', () => window.location.reload());

    if (feature === 'readWrite') {
      ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          handleAccountsChanged(accounts as string[]);
          ethereum.on('accountsChanged', handleAccountsChanged);
        })
        .catch((err) => {
          setError({ code: 'unexpectedError', message: err.message });
        });
    }

    return () => {
      ethereum.removeAllListeners();
    };
  }, [ethereum, handleAccountsChanged, feature]);

  return { error, provider, account, ethereum };
}

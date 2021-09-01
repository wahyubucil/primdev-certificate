import React, { VFC } from 'react';
import { getContractConfig } from '@/contract-config';
import { useMetaMask } from '@/hooks/useMetaMask';
import {
  CopyrightOutlined,
  GithubOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Spin, Typography } from 'antd';
import classNames from 'classnames';
import './Footer.scss';

const { Text, Link } = Typography;

export const ContractAddress: VFC = () => {
  const { error, provider } = useMetaMask();

  if (error) return <Text>Not connected</Text>;

  if (!provider) return <Spin indicator={<LoadingOutlined spin />} />;

  const config = getContractConfig(provider);

  if (!config?.address) return <Text>None</Text>;

  if (!config.blockExplorerUrl) return <Text copyable>{config.address}</Text>;

  return (
    <Link
      href={`${config.blockExplorerUrl}/address/${config.address}`}
      style={{ wordBreak: 'break-word' }}
      copyable
      target="_blank"
    >
      {config.address}
    </Link>
  );
};

export const Footer: VFC<{
  withPadding?: boolean;
  withContractAddress?: boolean;
}> = ({ withPadding = true, withContractAddress = true }) => (
  <div
    className={classNames(['Footer', { 'Footer--with-padding': withPadding }])}
  >
    {withContractAddress && (
      <div className="Footer__contract-address">
        Contract Address : <ContractAddress />
      </div>
    )}
    <div className="Footer__links">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/primakara-developers"
      >
        Primakara Developers
      </a>
      <a
        title="github"
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/wahyubucil/primdev-certificate"
      >
        <GithubOutlined />
      </a>
      <a target="_blank" rel="noopener noreferrer" href="https://nextap.co">
        Nextap &amp; Company
      </a>
    </div>
    <div>
      <CopyrightOutlined /> {new Date().getFullYear()} Created by{' '}
      <a
        href="https://wahyubucil.web.app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Wahyu Budi Saputra
      </a>
    </div>
  </div>
);

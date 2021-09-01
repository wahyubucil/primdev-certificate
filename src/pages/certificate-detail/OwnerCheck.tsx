import React, { FC, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, message, Space, Spin, Typography } from 'antd';
import { useMetaMask } from '@/hooks/useMetaMask';
import { CertificateManager__factory } from '@/contract-types';
import { getContractConfig } from '@/contract-config';

const { Text } = Typography;

export const OwnerCheck: FC = ({ children }) => {
  const { error, provider, account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState<string>();
  const config = getContractConfig(provider);

  useEffect(() => {
    if (!provider || !account || !config?.address) return;

    setLoading(true);
    const certificateManager = CertificateManager__factory.connect(
      config.address,
      provider,
    );
    certificateManager.owner().then((value) => {
      setOwner(value.toLowerCase());
      setLoading(false);
    });
  }, [provider, account, config]);

  if (error) return null;

  if (account === null || loading)
    return (
      <Space>
        Loading Owner Check <Spin indicator={<LoadingOutlined spin />} />
      </Space>
    );

  if (!config?.address) return null;

  if (account === false || !owner) {
    function doConnect() {
      connect().catch(() => message.error('Please accept to continue!'));
    }

    return (
      <Space direction="vertical">
        <Text>Connect your account to modify data</Text>
        <Button type="primary" onClick={doConnect}>
          Connect MetaMask
        </Button>
      </Space>
    );
  }

  if (account !== owner) {
    return (
      <Space direction="vertical">
        <Text>Can't modify data because your account is not the owner</Text>
        <Text style={{ wordBreak: 'break-word' }}>
          Owner address:
          <br />
          {owner}
        </Text>
        <Text style={{ wordBreak: 'break-word' }}>
          Your account:
          <br />
          {account}
        </Text>
      </Space>
    );
  }

  return <>{children}</>;
};

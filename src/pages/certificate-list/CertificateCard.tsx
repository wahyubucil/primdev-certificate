import React, { useEffect, useState, VFC } from 'react';
import { Link } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Spin, Typography } from 'antd';
import type { BaseType } from 'antd/lib/typography/Base';
import type { Certificate } from '@/models/Certificate';
import { useMetaMask } from '@/hooks/useMetaMask';
import { CertificateManager__factory } from '@/contract-types';
import './CertificateCard.scss';
import { getContractConfig } from '@/contract-config';

const { Text } = Typography;

type BlockchainStatus =
  | 'Available'
  | 'Not available'
  | 'Not connected'
  | 'Network not supported';
function blockchainStatusType(status: BlockchainStatus): BaseType | undefined {
  switch (status) {
    case 'Available':
      return 'success';
    case 'Not available':
      return 'danger';
    default:
      return undefined;
  }
}

export const CertificateCard: VFC<{ data: Certificate }> = ({ data }) => {
  const [blockchainStatus, setBlockchainStatus] = useState<BlockchainStatus>();
  const { error, provider } = useMetaMask();

  useEffect(() => {
    if (error) {
      setBlockchainStatus('Not connected');
      return;
    }

    if (!provider) return;

    const config = getContractConfig(provider);
    if (!config?.address) {
      setBlockchainStatus('Network not supported');
      return;
    }

    const certificateManager = CertificateManager__factory.connect(
      config.address,
      provider,
    );
    certificateManager
      .getCertificate(data.code)
      .then(() => setBlockchainStatus('Available'))
      .catch(() => setBlockchainStatus('Not available'));
  }, [error, provider, data]);

  return (
    <Link to={`/dashboard/${data.code}`} className="CertificateCard">
      <Card title={data.name} extra={`Code: ${data.code}`}>
        <Space direction="vertical">
          <Row justify="space-between">
            <Col>Status</Col>
            <Col>
              <Text type={data.status === 'Available' ? 'success' : 'danger'}>
                {data.status}
              </Text>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>Expired</Col>
            <Col>
              <Text type={data.status === 'Expired' ? 'danger' : undefined}>
                {data.expiredAt
                  ? data.expiredAt.format('DD MMMM YYYY')
                  : 'None'}
              </Text>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>Blockchain</Col>
            <Col>
              {blockchainStatus ? (
                <Text type={blockchainStatusType(blockchainStatus)}>
                  {blockchainStatus}
                </Text>
              ) : (
                <Spin indicator={<LoadingOutlined spin />} />
              )}
            </Col>
          </Row>
        </Space>
      </Card>
    </Link>
  );
};

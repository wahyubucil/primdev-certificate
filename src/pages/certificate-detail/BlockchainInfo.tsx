import React, { useEffect, useState, VFC } from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Col, Radio, Row, Space, Spin, Typography } from 'antd';
import { Certificate } from '@/models/Certificate';
import { useMetaMask } from '@/hooks/useMetaMask';
import { CertificateManager__factory } from '@/contract-types';
import { CertificateContract } from '@/models/CertificateContract';

const { Text, Paragraph } = Typography;

export const BlockchainInfo: VFC<{ certificate: Certificate }> = ({
  certificate,
}) => {
  const { error, provider } = useMetaMask();
  const [data, setData] = useState<CertificateContract>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider) return;

    const certificateManager = CertificateManager__factory.connect(
      import.meta.env.SNOWPACK_PUBLIC_CONTRACT_ADDRESS,
      provider,
    );
    certificateManager
      .getCertificate(certificate.code)
      .then((value) => setData(CertificateContract.fromGetter(value)))
      .finally(() => setLoading(false));
  }, [provider, certificate]);

  if (error) return <Text>Not connected</Text>;

  if (loading) return <Spin />;

  if (!data) {
    return (
      <>
        <Paragraph>Not available</Paragraph>
        <Button type="primary">Create</Button>
      </>
    );
  }

  return (
    <Space direction="vertical" style={{ display: 'flex' }} size="middle">
      <Row justify="space-between">
        <Col>
          <Text strong>Created</Text>
        </Col>
        <Col>
          <Text>22 July 2022</Text>
        </Col>
      </Row>
      <Row justify="space-between">
        <Col>
          <Text strong>State</Text>
        </Col>
        <Col>
          <Text>Created</Text>
        </Col>
      </Row>
      <Row justify="space-between">
        <Col>
          <Text strong>Metadata</Text>
        </Col>
        <Col>
          <CheckCircleFilled style={{ fontSize: '18px', color: '#52c41a' }} />
        </Col>
      </Row>
      <Row justify="space-between">
        <Col>
          <Text strong>Participants</Text>
        </Col>
        <Col>
          <CheckCircleFilled style={{ fontSize: '18px', color: '#52c41a' }} />
        </Col>
      </Row>
      <Radio.Group>
        <Space direction="vertical">
          <Radio value={1}>Update Metadata</Radio>
          <Radio value={2}>Update Participants (Recommended)</Radio>
          <Radio value={3}>Update All</Radio>
        </Space>
      </Radio.Group>
      <Button type="primary">Update</Button>
    </Space>
  );
};

import React, { useCallback, useEffect, useState, VFC } from 'react';
import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  message,
  Radio,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import to from 'await-to-js';
import { Certificate } from '@/models/Certificate';
import { useMetaMask } from '@/hooks/useMetaMask';
import { CertificateManager__factory } from '@/contract-types';
import { CertificateContract } from '@/models/CertificateContract';
import { OwnerCheck } from './OwnerCheck';

const { Text, Paragraph } = Typography;

export const BlockchainInfo: VFC<{ certificate: Certificate }> = ({
  certificate,
}) => {
  const { error, provider } = useMetaMask();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CertificateContract>();

  const getData = useCallback(async () => {
    if (!provider) return;

    const certificateManager = CertificateManager__factory.connect(
      import.meta.env.SNOWPACK_PUBLIC_CONTRACT_ADDRESS,
      provider,
    );

    const [, value] = await to(
      certificateManager.getCertificate(certificate.code),
    );
    if (value) setData(CertificateContract.fromGetter(value));
    setLoading(false);
  }, [provider, certificate]);

  useEffect(() => {
    getData();
  }, [getData]);

  if (error) return <Text>Not connected</Text>;

  if (loading)
    return (
      <Space>
        Loading Blockchain Data <Spin indicator={<LoadingOutlined spin />} />
      </Space>
    );

  if (!data) {
    async function create() {
      const signer = provider?.getSigner();
      if (!signer) return;

      const certificateManager = CertificateManager__factory.connect(
        import.meta.env.SNOWPACK_PUBLIC_CONTRACT_ADDRESS,
        signer,
      );

      const { code, name, expiredAt, participantsWithHash } = certificate;
      const [err, transaction] = await to(
        certificateManager.create(
          code,
          name,
          expiredAt?.unix() ?? 0,
          participantsWithHash,
        ),
      );
      if (err) {
        message.error('Please accept to continue!');
        return;
      }

      setLoading(true);
      await transaction?.wait();
      await getData();
    }

    return (
      <>
        <Paragraph>Not available</Paragraph>
        <OwnerCheck>
          <Button type="primary" onClick={create}>
            Create
          </Button>
        </OwnerCheck>
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

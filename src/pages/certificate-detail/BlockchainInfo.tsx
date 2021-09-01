import React, { useCallback, useEffect, useMemo, useState, VFC } from 'react';
import {
  CheckCircleFilled,
  ExclamationCircleFilled,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  message,
  Radio,
  Row,
  Space,
  Spin,
  Tooltip,
  Typography,
} from 'antd';
import to from 'await-to-js';
import { ethers } from 'ethers';
import { Certificate } from '@/models/Certificate';
import { useMetaMask } from '@/hooks/useMetaMask';
import { CertificateManager__factory } from '@/contract-types';
import { CertificateContract, State } from '@/models/CertificateContract';
import { OwnerCheck } from './OwnerCheck';
import { getContractConfig } from '@/contract-config';

type UpdateMethod = 'metadata' | 'participants' | 'all';

const { Text } = Typography;

export const BlockchainInfo: VFC<{ certificate: Certificate }> = ({
  certificate,
}) => {
  const { error, provider } = useMetaMask();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CertificateContract>();
  const [updateMethod, setUpdateMethod] = useState<UpdateMethod | null>(null);
  const config = getContractConfig(provider);

  const getData = useCallback(async () => {
    if (!provider) return;

    if (!config || !config.address) {
      setLoading(false);
      return;
    }

    const certificateManager = CertificateManager__factory.connect(
      config.address,
      provider,
    );

    const [, value] = await to(
      certificateManager.getCertificate(certificate.code),
    );
    if (value) setData(CertificateContract.fromGetter(value));
    setLoading(false);
  }, [provider, certificate, config]);

  useEffect(() => {
    getData();
  }, [getData]);

  const isSameMetadata = useMemo(() => {
    if (!data) return false;

    const certificateMetadataHash = ethers.utils
      .keccak256(
        ethers.utils.solidityPack(
          ['string', 'uint256'],
          [certificate.name, certificate.expiredAt?.unix() ?? 0],
        ),
      )
      .toLowerCase();

    return data.metadataHash === certificateMetadataHash;
  }, [data, certificate]);

  const isSameParticipants = useMemo(() => {
    if (!data) return false;

    const participantsHash = ethers.utils
      .keccak256(
        ethers.utils.solidityPack(
          Array(certificate.participants.length).fill('bytes32'),
          certificate.participantsWithHash,
        ),
      )
      .toLowerCase();

    return data.participantsHash === participantsHash;
  }, [data, certificate]);

  if (error) return <Text>Not connected</Text>;

  if (loading)
    return (
      <Space>
        Loading Blockchain Data <Spin indicator={<LoadingOutlined spin />} />
      </Space>
    );

  if (!config || !config.address) return <Text>Network not supported</Text>;

  if (!data) {
    async function create() {
      const signer = provider?.getSigner();
      if (!signer) return;

      const certificateManager = CertificateManager__factory.connect(
        config!.address!,
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
      message.success('Blockchain data created');
      await getData();
    }

    return (
      <Space direction="vertical">
        <Text>Not available</Text>
        {certificate.status !== 'Revoked' && (
          <OwnerCheck>
            <Button type="primary" onClick={create}>
              Create
            </Button>
          </OwnerCheck>
        )}
      </Space>
    );
  }

  async function update() {
    if (!updateMethod) {
      message.error('Please choose update method!');
      return;
    }

    const signer = provider?.getSigner();
    if (!signer) return;

    const certificateManager = CertificateManager__factory.connect(
      config!.address!,
      signer,
    );

    let err: Error | null;
    let transaction: ethers.ContractTransaction | undefined;

    if (updateMethod === 'metadata') {
      [err, transaction] = await to(
        certificateManager.updateMetadata(
          certificate.code,
          certificate.name,
          certificate.expiredAt?.unix() ?? 0,
        ),
      );
    } else if (updateMethod === 'participants') {
      [err, transaction] = await to(
        certificateManager.updateParticipants(
          certificate.code,
          certificate.participantsWithHash,
        ),
      );
    } else {
      [err, transaction] = await to(
        certificateManager.update(
          certificate.code,
          certificate.name,
          certificate.expiredAt?.unix() ?? 0,
          certificate.participantsWithHash,
        ),
      );
    }

    if (err) {
      message.error('Please accept to continue!');
      return;
    }

    setLoading(true);
    await transaction?.wait();
    message.success('Blockchain data updated');
    setUpdateMethod(null);
    await getData();
  }

  return (
    <Space direction="vertical" style={{ display: 'flex' }} size="middle">
      <Row justify="space-between">
        <Col>
          <Text strong>Created</Text>
        </Col>
        <Col>
          <Text>{data.createdAt.format('DD MMMM YYYY')}</Text>
        </Col>
      </Row>
      <Row justify="space-between">
        <Col>
          <Text strong>State</Text>
        </Col>
        <Col>
          <Text>{State[data.state]}</Text>
        </Col>
      </Row>
      <Row justify="space-between">
        <Col>
          <Text strong>Metadata</Text>
        </Col>
        <Col>
          {isSameMetadata ? (
            <CheckCircleFilled style={{ fontSize: '18px', color: '#52c41a' }} />
          ) : (
            <Tooltip title="Need update to synchronize data" placement="left">
              <ExclamationCircleFilled
                style={{ fontSize: '18px', color: '#faad14' }}
              />
            </Tooltip>
          )}
        </Col>
      </Row>
      <Row justify="space-between">
        <Col>
          <Text strong>Participants</Text>
        </Col>
        <Col>
          {isSameParticipants ? (
            <CheckCircleFilled style={{ fontSize: '18px', color: '#52c41a' }} />
          ) : (
            <Tooltip title="Need update to synchronize data" placement="left">
              <ExclamationCircleFilled
                style={{ fontSize: '18px', color: '#faad14' }}
              />
            </Tooltip>
          )}
        </Col>
      </Row>
      {data.state !== State.Revoked && (
        <OwnerCheck>
          <Space direction="vertical" size="middle">
            <Radio.Group
              name="update_method"
              value={updateMethod}
              onChange={(e) => setUpdateMethod(e.target.value)}
            >
              <Space direction="vertical">
                <Radio value="metadata">
                  Update Metadata{' '}
                  {!isSameMetadata && isSameParticipants && '(Recommended)'}
                </Radio>
                <Radio value="participants">
                  Update Participants{' '}
                  {!isSameParticipants && isSameMetadata && '(Recommended)'}
                </Radio>
                <Radio value="all">
                  Update All{' '}
                  {!isSameMetadata && !isSameParticipants && '(Recommended)'}
                </Radio>
              </Space>
            </Radio.Group>
            <Button type="primary" onClick={update}>
              Update
            </Button>
          </Space>
        </OwnerCheck>
      )}
    </Space>
  );
};

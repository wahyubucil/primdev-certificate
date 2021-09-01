import React, { useEffect, useState, VFC } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  message,
  Modal,
  Result,
  Row,
  Space,
  Typography,
} from 'antd';
import type { BaseType } from 'antd/lib/typography/Base';
import to from 'await-to-js';
import {
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { useHistory, useParams } from 'react-router-dom';
import './index.scss';
import { Loader } from '@/components/Loader';
import { MetaMaskDetector } from '@/components/MetaMaskDetector';
import { ModalCertificateForm } from '@/components/ModalCertificateForm';
import { Certificate } from '@/models/Certificate';
import { BlockchainInfo } from './BlockchainInfo';
import { Participants } from './Participants';
import { useMetaMask } from '@/hooks/useMetaMask';
import { CertificateManager__factory } from '@/contract-types';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { getContractConfig } from '@/contract-config';

const { Title, Text } = Typography;

const NotFound: VFC = () => {
  const history = useHistory();

  return (
    <Result
      status="404"
      title="Not found"
      subTitle="The certificate you're looking for doesn't exist"
      extra={
        <Button type="primary" onClick={() => history.push('/dashboard')}>
          Go To Dashboard
        </Button>
      }
    />
  );
};

const CertificateDetail: VFC = () => {
  const { code } = useParams<{ code: string }>();
  const db = getFirestore();
  const history = useHistory();
  const { provider, account } = useMetaMask();
  const screens = useBreakpoint();

  const [certificate, setCertificate] = useState<Certificate>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'certificates', code), (doc) => {
      setLoading(false);
      if (!doc.exists()) return;
      setCertificate(Certificate.fromFirestore(code, doc.data()));
    });

    return () => {
      unsub();
    };
  }, [db, code]);

  if (loading) return <Loader />;

  if (!certificate) return <NotFound />;

  function revoke(code: number) {
    if (!provider) {
      message.error('Please install MetaMask to continue!');
      return;
    }

    const config = getContractConfig(provider);
    if (!config || !config.address) {
      message.error('Network not supported');
      return;
    }

    Modal.confirm({
      title: 'Are you sure to revoke this certificate?',
      icon: <ExclamationCircleOutlined />,
      content: "You won't be able to edit the data once it's revoked!",
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const certificateManager = CertificateManager__factory.connect(
          config.address!,
          provider,
        );
        const [, certificate] = await to(
          certificateManager.getCertificate(code),
        );

        if (certificate) {
          if (!account) {
            message.error('Please connect MetaMask to continue!');
            return;
          }

          const owner = (await certificateManager.owner()).toLowerCase();
          if (owner !== account) {
            message.error('Your account is not the owner!');
            return;
          }

          const signer = provider.getSigner();
          const [err, transaction] = await to(
            certificateManager.connect(signer).revoke(code),
          );
          if (err) {
            message.error('Please accept to continue!');
            return;
          }
          await transaction?.wait();
        }

        const docRef = doc(db, 'certificates', code.toString());
        await updateDoc(docRef, { revoked: true });
        message.success('Certificate revoked');
      },
    });
  }

  function remove(code: number) {
    if (!provider) {
      message.error('Please install MetaMask to continue!');
      return;
    }

    const config = getContractConfig(provider);
    if (!config || !config.address) {
      message.error('Network not supported');
      return;
    }

    Modal.confirm({
      title: 'Are you sure to remove this certificate?',
      icon: <ExclamationCircleOutlined />,
      content: "You won't be able to undo this action!",
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const certificateManager = CertificateManager__factory.connect(
          config.address!,
          provider,
        );
        const [, certificate] = await to(
          certificateManager.getCertificate(code),
        );

        if (certificate) {
          if (!account) {
            message.error('Please connect MetaMask to continue!');
            return;
          }

          const owner = (await certificateManager.owner()).toLowerCase();
          if (owner !== account) {
            message.error('Your account is not the owner!');
            return;
          }

          const signer = provider.getSigner();
          const [err, transaction] = await to(
            certificateManager.connect(signer).remove(code),
          );
          if (err) {
            message.error('Please accept to continue!');
            return;
          }
          await transaction?.wait();
        }

        const docRef = doc(db, 'certificates', code.toString());
        await deleteDoc(docRef);
        message.success('Certificate removed');
        history.push('/dashboard');
      },
    });
  }

  const isNotRevoked = certificate.status !== 'Revoked';
  const buttons = (
    <Space direction={screens.xs ? 'vertical' : 'horizontal'}>
      {isNotRevoked && (
        <Button
          icon={<EditOutlined />}
          onClick={() => ModalCertificateForm.show({ data: certificate })}
        >
          Edit
        </Button>
      )}
      {isNotRevoked && (
        <Button
          icon={<UndoOutlined />}
          danger
          onClick={() => revoke(certificate.code)}
        >
          Revoke
        </Button>
      )}
      <Button
        icon={<DeleteOutlined />}
        danger
        type="primary"
        onClick={() => remove(certificate.code)}
      >
        Remove
      </Button>
    </Space>
  );

  const info = (label: string, value: string, type?: BaseType) => (
    <Col xs={screens.xs ? 24 : undefined}>
      <Space size="middle">
        <Text strong>{label}</Text>
        <Text type={type}>{value}</Text>
      </Space>
    </Col>
  );

  return (
    <>
      <MetaMaskDetector style={{ marginBottom: 16 }} />
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            className="CertificateDetail__card"
            title={<Title level={3}>{certificate.name}</Title>}
            extra={buttons}
          >
            <Row justify="space-between" gutter={[0, 8]}>
              {info('Code', certificate.code.toString())}
              {info(
                'Status',
                certificate.status,
                certificate.status === 'Available' ? 'success' : 'danger',
              )}
              {info(
                'Expired',
                certificate.expiredAt
                  ? certificate.expiredAt.format('DD MMMM YYYY')
                  : 'None',
                certificate.status === 'Expired' ? 'danger' : undefined,
              )}
            </Row>
            <Participants
              code={certificate.code}
              data={certificate.participants}
              revoked={certificate.status === 'Revoked'}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Blockchain Information">
            <BlockchainInfo certificate={certificate} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CertificateDetail;

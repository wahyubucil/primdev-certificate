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
import {
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { useHistory, useParams } from 'react-router-dom';
import { Loader } from '@/components/Loader';
import { MetaMaskDetector } from '@/components/MetaMaskDetector';
import { ModalCertificateForm } from '@/components/ModalCertificateForm';
import { Certificate } from '@/models/Certificate';
import { BlockchainInfo } from './BlockchainInfo';
import { Participants } from './Participants';

const { Title, Text } = Typography;

const info = (label: string, value: string, type?: BaseType) => (
  <Space size="middle">
    <Text strong>{label}</Text>
    <Text type={type}>{value}</Text>
  </Space>
);

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
    Modal.confirm({
      title: 'Are you sure to revoke this certificate?',
      icon: <ExclamationCircleOutlined />,
      content: "You won't be able to edit the data once it's revoked!",
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const docRef = doc(db, 'certificates', code.toString());
        await updateDoc(docRef, { revoked: true });
        message.success('Certificate revoked');
      },
    });
  }

  function remove(code: number) {
    Modal.confirm({
      title: 'Are you sure to remove this certificate?',
      icon: <ExclamationCircleOutlined />,
      content: "You won't be able to undo this action!",
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const docRef = doc(db, 'certificates', code.toString());
        await deleteDoc(docRef);
        message.success('Certificate removed');
        history.push('/dashboard');
      },
    });
  }

  const isNotRevoked = certificate.status !== 'Revoked';
  const buttons = (
    <Space>
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

  return (
    <>
      <MetaMaskDetector style={{ marginBottom: 16 }} />
      <Row gutter={24}>
        <Col span={16}>
          <Card
            title={<Title level={3}>{certificate.name}</Title>}
            extra={buttons}
          >
            <Row justify="space-between">
              <Col>{info('Code', certificate.code.toString())}</Col>
              <Col>
                {info(
                  'Status',
                  certificate.status,
                  certificate.status === 'Available' ? 'success' : 'danger',
                )}
              </Col>
              <Col>
                {info(
                  'Expired',
                  certificate.expiredAt
                    ? certificate.expiredAt.format('DD MMMM YYYY')
                    : 'None',
                  certificate.status === 'Expired' ? 'danger' : undefined,
                )}
              </Col>
            </Row>
            <Participants
              code={certificate.code}
              data={certificate.participants}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Blockchain Information">
            <BlockchainInfo certificate={certificate} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CertificateDetail;

import { Loader } from '@/components/Loader';
import { Certificate } from '@/models/Certificate';
import { DeleteOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Card, Col, Result, Row, Space, Typography } from 'antd';
import type { BaseType } from 'antd/lib/typography/Base';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState, VFC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { BlockchainInfo } from './BlockchainInfo';
import { Participants } from './Participants';

const { Title, Text } = Typography;

const buttons = (
  <Space>
    <Button icon={<EditOutlined />}>Edit</Button>
    <Button icon={<UndoOutlined />} danger>
      Revoke
    </Button>
    <Button icon={<DeleteOutlined />} danger type="primary">
      Remove
    </Button>
  </Space>
);

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

  return (
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
          <Participants />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Blockchain Information">
          <BlockchainInfo />
        </Card>
      </Col>
    </Row>
  );
};

export default CertificateDetail;

import React, { useEffect, useState, VFC } from 'react';
import { Button, List, Row, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import dayjs from 'dayjs';
import type { Certificate } from '@/interfaces/Certificate';
import { CertificateCard } from './CertificateCard';
import { ModalCertificateForm } from '@/components/ModalCertificateForm';

const CertificateList: VFC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>();
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, 'certificates'), orderBy('code'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setLoading(false);
      const newCertificates: Certificate[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          code: data.code,
          name: data.name,
          expiredAt: data.expiredAt
            ? dayjs((data.expiredAt as Timestamp).toDate())
            : null,
          participants: data.participants,
        };
      });
      setCertificates(newCertificates);
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Row justify="space-between">
        <h1>Certificate List</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => ModalCertificateForm.show()}
        >
          Create
        </Button>
      </Row>
      <List
        dataSource={certificates}
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        rowKey={(item) => item.code.toString()}
        renderItem={(item) => (
          <List.Item>
            <CertificateCard data={item} />
          </List.Item>
        )}
      />
    </Space>
  );
};

export default CertificateList;

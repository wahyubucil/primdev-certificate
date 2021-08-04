import React, { useEffect, useState, VFC } from 'react';
import { Alert, Button, List, Row, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { Certificate } from '@/models/Certificate';
import { ModalCertificateForm } from '@/components/ModalCertificateForm';
import { useMetaMask } from '@/hooks/useMetaMask';
import { CertificateCard } from './CertificateCard';

const CertificateList: VFC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>();
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, 'certificates'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setLoading(false);
      const data: Certificate[] = querySnapshot.docs.map((doc) =>
        Certificate.fromFirestore(doc.id, doc.data()),
      );
      setCertificates(data);
    });

    return () => unsubscribe();
  }, [db]);

  const { error } = useMetaMask('readOnly');

  const history = useHistory();
  function showModalCreate() {
    ModalCertificateForm.show({
      onSuccess: ({ code }) => history.push(`/dashboard/${code}`),
    });
  }

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Row justify="space-between">
        <h1>Certificate List</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={showModalCreate}
        >
          Create
        </Button>
      </Row>
      {error && (
        <Alert
          type="warning"
          message={error.message}
          showIcon
          action={
            error.code === 'notInstalled' && (
              <Button
                size="small"
                type="link"
                href="https://metamask.io/download.html"
                target="_blank"
              >
                Install
              </Button>
            )
          }
        />
      )}
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

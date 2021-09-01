import React, { useEffect, useState, FC } from 'react';
import { Button, List, Row, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { Certificate } from '@/models/Certificate';
import { ModalCertificateForm } from '@/components/ModalCertificateForm';
import { CertificateCard } from './CertificateCard';
import { MetaMaskDetector } from '@/components/MetaMaskDetector';

const CertificateList: FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>();
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    getDocs(collection(db, 'certificates')).then((querySnapshot) => {
      setLoading(false);
      const data: Certificate[] = querySnapshot.docs.map((doc) =>
        Certificate.fromFirestore(doc.id, doc.data()),
      );
      setCertificates(data);
    });
  }, [db]);

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
      <MetaMaskDetector />
      <List
        dataSource={certificates}
        loading={loading}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, column: 3 }}
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

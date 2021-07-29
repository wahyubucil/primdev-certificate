import { Button, List, Row, Space } from 'antd';
import React, { VFC } from 'react';
import type { Certificate } from '@/interfaces/Certificate';
import { CertificateCard } from './CertificateCard';
import { PlusOutlined } from '@ant-design/icons';

const sampleData: Certificate[] = [
  {
    id: 1,
    name: 'Workshop HTML',
  },
  {
    id: 2,
    name: 'Workshop CSS',
  },
  {
    id: 3,
    name: 'DevShare',
  },
  {
    id: 4,
    name: 'Summer Code',
  },
];

const CertificateList: VFC = () => (
  <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
    <Row justify="space-between">
      <h1>Certificate List</h1>
      <Button type="primary" icon={<PlusOutlined />} size="large">
        Create
      </Button>
    </Row>
    <List
      dataSource={sampleData}
      grid={{ gutter: 16, column: 3 }}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <CertificateCard data={item} />
        </List.Item>
      )}
    />
  </Space>
);

export default CertificateList;

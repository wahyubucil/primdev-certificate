import { DeleteOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import type { BaseType } from 'antd/lib/typography/Base';
import React, { FC } from 'react';
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

const CertificateDetail: FC = () => (
  <Row gutter={24}>
    <Col span={16}>
      <Card title={<Title level={3}>Workshop HTML</Title>} extra={buttons}>
        <Row justify="space-between">
          <Col>{info('Code', '1')}</Col>
          <Col>{info('Status', 'Available', 'success')}</Col>
          <Col>{info('Expired', '22 July 2022', 'danger')}</Col>
        </Row>
        <Participants />
      </Card>
    </Col>
    <Col span={8}>
      <Card title="Blockchain Information"></Card>
    </Col>
  </Row>
);

export default CertificateDetail;

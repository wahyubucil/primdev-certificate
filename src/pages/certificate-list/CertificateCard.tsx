import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Certificate } from '@/interfaces/Certificate';
import { Card, Col, Row, Space, Typography } from 'antd';
import './CertificateCard.scss';

const { Text } = Typography;

export const CertificateCard: FC<{ data: Certificate }> = ({ data }) => (
  <Link to={`/dashboard/${data.id}`} className="CertificateCard">
    <Card title={data.name} extra={`Code: ${data.id}`}>
      <Space direction="vertical">
        <Row justify="space-between">
          <Col>Status</Col>
          <Col>
            <Text type="danger">Expired</Text>
          </Col>
        </Row>
        <Row justify="space-between">
          <Col>Expired</Col>
          <Col>
            <Text type="danger">31 July 2022</Text>
          </Col>
        </Row>
        <Row justify="space-between">
          <Col>Blockchain</Col>
          <Col>
            <Text type="warning">Need update</Text>
          </Col>
        </Row>
      </Space>
    </Card>
  </Link>
);

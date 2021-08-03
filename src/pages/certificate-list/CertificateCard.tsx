import React, { VFC } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Space, Typography } from 'antd';
import type { Certificate } from '@/models/Certificate';
import './CertificateCard.scss';

const { Text } = Typography;

export const CertificateCard: VFC<{ data: Certificate }> = ({ data }) => {
  return (
    <Link to={`/dashboard/${data.code}`} className="CertificateCard">
      <Card title={data.name} extra={`Code: ${data.code}`}>
        <Space direction="vertical">
          <Row justify="space-between">
            <Col>Status</Col>
            <Col>
              <Text type={data.status === 'Available' ? 'success' : 'danger'}>
                {data.status}
              </Text>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>Expired</Col>
            <Col>
              <Text type={data.status === 'Expired' ? 'danger' : undefined}>
                {data.expiredAt
                  ? data.expiredAt.format('DD MMMM YYYY')
                  : 'None'}
              </Text>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>Blockchain</Col>
            <Col>
              <Text type="danger">Not available</Text>
            </Col>
          </Row>
        </Space>
      </Card>
    </Link>
  );
};

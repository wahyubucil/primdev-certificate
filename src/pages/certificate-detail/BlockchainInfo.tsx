import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Col, Radio, Row, Space, Typography } from 'antd';
import React, { VFC } from 'react';

const { Text } = Typography;

export const BlockchainInfo: VFC = () => (
  <Space direction="vertical" style={{ display: 'flex' }} size="middle">
    <Row justify="space-between">
      <Col>
        <Text strong>Created</Text>
      </Col>
      <Col>
        <Text>22 July 2022</Text>
      </Col>
    </Row>
    <Row justify="space-between">
      <Col>
        <Text strong>State</Text>
      </Col>
      <Col>
        <Text>Created</Text>
      </Col>
    </Row>
    <Row justify="space-between">
      <Col>
        <Text strong>Metadata</Text>
      </Col>
      <Col>
        <CheckCircleFilled style={{ fontSize: '18px', color: '#52c41a' }} />
      </Col>
    </Row>
    <Row justify="space-between">
      <Col>
        <Text strong>Participants</Text>
      </Col>
      <Col>
        <CheckCircleFilled style={{ fontSize: '18px', color: '#52c41a' }} />
      </Col>
    </Row>
    <Radio.Group>
      <Space direction="vertical">
        <Radio value={1}>Update Metadata</Radio>
        <Radio value={2}>Update Participants (Recommended)</Radio>
        <Radio value={3}>Update All</Radio>
      </Space>
    </Radio.Group>
    <Button type="primary">Update</Button>
  </Space>
);

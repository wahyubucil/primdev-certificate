import React, { VFC } from 'react';
import { Button, Form, Input, Result, Typography } from 'antd';
import logo from '@/assets/logo-primakara-developers.svg';
import { Footer } from '@/components/Footer';
import './index.scss';

const { Title, Paragraph, Text } = Typography;

const Home: VFC = () => (
  <div className="Home">
    <img src={logo} alt="Logo Primakara Developers" className="Home__logo" />
    <div className="Home__content">
      <Title level={3} className="Home__title">
        Certificate Validity Checker
      </Title>
      <Form className="Home__form" layout="vertical" requiredMark={false}>
        <Form.Item label="Code" name="code" rules={[{ required: true }]}>
          <Input placeholder="Insert code from the certificate" />
        </Form.Item>
        <Form.Item
          label="Participant Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Insert participant name on the certificate" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" block>
            Check
          </Button>
        </Form.Item>
      </Form>
      <Result status="success" title="Certificate Valid" style={{ padding: 0 }}>
        <Paragraph>
          <Text strong style={{ fontSize: 16 }}>
            Certificate Information
          </Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Name :</Text> Workshop HTML
        </Paragraph>
        <Paragraph>
          <Text strong>Expired :</Text> None
        </Paragraph>
        <Paragraph>
          <Text strong>Created :</Text> 22 July 2022
        </Paragraph>
      </Result>
    </div>
    <Footer />
  </div>
);

export default Home;

import React, { VFC } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import logo from '@/assets/logo-primakara-developers.svg';
import { Footer } from '@/components/Footer';
import './index.scss';

const Login: VFC = () => (
  <div className="Login">
    <div className="Login__content">
      <img src={logo} alt="Logo Primakara Developers" className="Login__logo" />
      <Typography.Title level={3} className="Login__title">
        Dashboard Login
      </Typography.Title>
      <Form className="Login__form">
        <Form.Item name="email" rules={[{ required: true }, { type: 'email' }]}>
          <Input
            prefix={<UserOutlined className="Login__input-icon" />}
            type="email"
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password
            prefix={<LockOutlined className="Login__input-icon" />}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
    <Footer />
  </div>
);

export default Login;

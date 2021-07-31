import React, { useState, VFC } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Typography } from 'antd';
import to from 'await-to-js';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import logo from '@/assets/logo-primakara-developers.svg';
import { Footer } from '@/components/Footer';
import './index.scss';

type FormValues = {
  email: string;
  password: string;
};

const auth = getAuth();

const Login: VFC = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function doLogin({ email, password }: FormValues) {
    if (loading) return;
    setLoading(true);

    const [err] = await to(signInWithEmailAndPassword(auth, email, password));
    setLoading(false);

    if (err) {
      message.error('Email / Password incorrect');
      return;
    }

    history.push('/dashboard');
  }

  return (
    <div className="Login">
      <div className="Login__content">
        <img
          src={logo}
          alt="Logo Primakara Developers"
          className="Login__logo"
        />
        <Typography.Title level={3} className="Login__title">
          Dashboard Login
        </Typography.Title>
        <Form className="Login__form" onFinish={doLogin}>
          <Form.Item
            name="email"
            rules={[{ required: true }, { type: 'email' }]}
          >
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
            <Button htmlType="submit" type="primary" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

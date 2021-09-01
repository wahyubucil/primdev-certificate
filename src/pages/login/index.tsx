import React, { useState, FC } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Typography } from 'antd';
import to from 'await-to-js';
import { useHistory, useLocation } from 'react-router-dom';
import logo from '@/assets/logo-primakara-developers.svg';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import './index.scss';

type FormValues = {
  email: string;
  password: string;
};

type Location = ReturnType<typeof useLocation>;

const Login: FC = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation<{ from: Location }>();
  const auth = useAuth();

  async function doLogin({ email, password }: FormValues) {
    setLoading(true);

    const [err] = await to(auth.login(email, password));

    if (err) {
      setLoading(false);
      message.error('Email / Password incorrect');
      return;
    }

    const from = location.state?.from ?? { pathname: '/dashboard' };
    history.replace(from);
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
      <Footer withContractAddress={false} />
    </div>
  );
};

export default Login;

import { Avatar, Col, Dropdown, Layout, Menu, Row } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import logo from '@/assets/logo-primakara-developers.svg';

const { Header, Content, Footer } = Layout;

const menu = (
  <Menu>
    <Menu.Item icon={<LogoutOutlined />}>
      <a onClick={() => console.log('Logout')}>Logout</a>
    </Menu.Item>
  </Menu>
);

export const Dashboard: FC = () => (
  <Layout>
    <Header className="Dashboard__header">
      <Row className="full-height">
        <Col flex="auto" className="full-height">
          <Link to="/dashboard">
            <img
              src={logo}
              alt="Logo Primakara Developers"
              className="full-height"
            />
          </Link>
        </Col>
        <Col>
          <Dropdown overlay={menu} placement="bottomRight">
            <div className="Dashboard__header-menu">
              <Avatar className="Dashboard__avatar" icon={<UserOutlined />} />
              <span>Administrator</span>
            </div>
          </Dropdown>
        </Col>
      </Row>
    </Header>
    <Content style={{ padding: '50px' }}>
      <div className="site-layout-content">Content</div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      Ant Design ©2018 Created by Ant UED
    </Footer>
  </Layout>
);

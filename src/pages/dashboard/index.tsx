import { Alert, Avatar, Col, Dropdown, Layout, Menu, Row } from 'antd';
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import React, { VFC, lazy, Suspense } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import './index.scss';
import logo from '@/assets/logo-primakara-developers.svg';
import { Loader } from '@/components/Loader';
import { Footer } from '@/components/Footer';

const CertificateList = lazy(() => import('../certificate-list'));
const CertificateDetail = lazy(() => import('../certificate-detail'));

const { Header, Content, Footer: AntdFooter } = Layout;

const menu = (
  <Menu>
    <Menu.Item icon={<LogoutOutlined />} key="logout">
      Logout
    </Menu.Item>
  </Menu>
);

const Dashboard: VFC = () => {
  const match = useRouteMatch();

  return (
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
                <span className="Dashboard__user">Administrator</span>
                <DownOutlined />
              </div>
            </Dropdown>
          </Col>
        </Row>
      </Header>
      <Content className="Dashboard__content">
        <Alert.ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route path={`${match.path}/:id`} component={CertificateDetail} />
              <Route path={match.path} component={CertificateList} />
            </Switch>
          </Suspense>
        </Alert.ErrorBoundary>
      </Content>
      <AntdFooter>
        <Footer withPadding={false} />
      </AntdFooter>
    </Layout>
  );
};

export default Dashboard;

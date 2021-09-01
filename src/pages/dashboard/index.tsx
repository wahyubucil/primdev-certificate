import {
  Alert,
  Avatar,
  Col,
  Dropdown,
  Grid,
  Layout,
  Menu,
  Row,
  Spin,
} from 'antd';
import {
  DownOutlined,
  LoadingOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React, { FC, lazy, Suspense, useEffect, useState } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import './index.scss';
import logo from '@/assets/logo-primakara-developers.svg';
import logoNoText from '@/assets/logo-primakara-developers-no-text.svg';
import { Loader } from '@/components/Loader';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

const CertificateList = lazy(() => import('../certificate-list'));
const CertificateDetail = lazy(() => import('../certificate-detail'));

const { Header, Content, Footer: AntdFooter } = Layout;

const Dashboard: FC = () => {
  const auth = useAuth();
  const match = useRouteMatch();
  const screens = Grid.useBreakpoint();

  // Get display name
  const [displayName, setDisplayName] = useState<string>();
  const db = getFirestore();
  useEffect(() => {
    const user = auth.user as User;
    if (user.displayName) {
      setDisplayName(user.displayName);
    } else {
      const docRef = doc(db, 'users', user.uid);
      getDoc(docRef).then((docSnap) => {
        if (!docSnap.exists()) return;
        setDisplayName(docSnap.data().displayName);
      });
    }
  }, [auth, db]);

  const menu = (
    <Menu>
      <Menu.Item icon={<LogoutOutlined />} key="logout" onClick={auth.logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Header className="Dashboard__header">
        <Row className="full-height">
          <Col flex="auto" className="full-height">
            <Link to="/dashboard">
              <img
                src={screens.xs ? logoNoText : logo}
                alt="Logo Primakara Developers"
                className="full-height"
              />
            </Link>
          </Col>
          <Col>
            <Dropdown overlay={menu} placement="bottomRight">
              <div className="Dashboard__header-menu">
                <Avatar className="Dashboard__avatar" icon={<UserOutlined />} />
                <span className="Dashboard__user">
                  {displayName || <Spin indicator={<LoadingOutlined spin />} />}
                </span>
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
              <Route
                path={`${match.path}/:code`}
                component={CertificateDetail}
              />
              <Route path={match.path} component={CertificateList} />
            </Switch>
          </Suspense>
        </Alert.ErrorBoundary>
      </Content>
      <AntdFooter className="Dashboard__footer">
        <Footer withPadding={false} />
      </AntdFooter>
    </Layout>
  );
};

export default Dashboard;

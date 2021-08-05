import React, { useState, VFC } from 'react';
import { Button, Form, Input, Result, Typography } from 'antd';
import to from 'await-to-js';
import logo from '@/assets/logo-primakara-developers.svg';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { useMetaMask } from '@/hooks/useMetaMask';
import { CertificateManager__factory } from '@/contract-types';
import { CertificateContract, Validity } from '@/models/CertificateContract';
import './index.scss';

interface FormValues {
  code: string;
  name: string;
}

interface ResultInfo {
  status: 'success' | 'error';
  message: string;
  certificate?: CertificateContract;
}

const { Title, Paragraph, Text } = Typography;

const Home: VFC = () => {
  const { error, provider } = useMetaMask();
  const [formLoading, setformLoading] = useState(false);
  const [result, setResult] = useState<ResultInfo>();

  if (error) {
    return (
      <div className="Home__error">
        <Result
          status="403"
          title={error.message}
          subTitle="Resolve the problem to continue"
          extra={
            error.code === 'notInstalled' && (
              <Button
                type="primary"
                href="https://metamask.io/download.html"
                target="_blank"
              >
                Install
              </Button>
            )
          }
        />
      </div>
    );
  }

  if (!provider) return <Loader />;

  async function check(values: FormValues) {
    if (!provider) return;

    setformLoading(true);
    const code = Number(values.code);
    const name = values.name.toLowerCase();

    const certificateManager = CertificateManager__factory.connect(
      import.meta.env.SNOWPACK_PUBLIC_CONTRACT_ADDRESS,
      provider,
    );
    const [, certificate] = await to(certificateManager.getCertificate(code));
    if (!certificate) {
      setResult({ status: 'error', message: 'Certificate Not Found' });
      setformLoading(false);
      return;
    }

    const [err, validity] = await to(
      certificateManager.checkValidity(code, name),
    );
    if (err) return;
    setResult({
      status: validity === Validity.Valid ? 'success' : 'error',
      message: `Certificate ${Validity[validity!]}`,
      certificate: CertificateContract.fromGetter(certificate),
    });
    setformLoading(false);
  }

  return (
    <div className="Home">
      <img src={logo} alt="Logo Primakara Developers" className="Home__logo" />
      <div className="Home__content">
        <Title level={3} className="Home__title">
          Certificate Validity Checker
        </Title>
        <Form
          className="Home__form"
          layout="vertical"
          requiredMark={false}
          onFinish={check}
        >
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
            <Button
              htmlType="submit"
              type="primary"
              block
              loading={formLoading}
            >
              Check
            </Button>
          </Form.Item>
        </Form>
        {result && (
          <Result
            status={result.status}
            title={result.message}
            style={{ padding: 0 }}
          >
            {result.certificate && (
              <>
                <Paragraph>
                  <Text strong style={{ fontSize: 16 }}>
                    Certificate Information
                  </Text>
                </Paragraph>
                <Paragraph>
                  <Text strong>Name :</Text> {result.certificate.name}
                </Paragraph>
                <Paragraph>
                  <Text strong>Expired :</Text>{' '}
                  {result.certificate.expiredAt
                    ? result.certificate.expiredAt.format('DD MMMM YYYY')
                    : 'None'}
                </Paragraph>
                <Paragraph>
                  <Text strong>Created :</Text>{' '}
                  {result.certificate.createdAt.format('DD MMMM YYYY')}
                </Paragraph>
              </>
            )}
          </Result>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;

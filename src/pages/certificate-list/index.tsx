import { List } from 'antd';
import type { FC } from 'react';
import React from 'react';
import type { Certificate } from '@/interfaces/Certificate';
import { CertificateCard } from './CertificateCard';

const sampleData: Certificate[] = [
  {
    id: 1,
    name: 'Workshop HTML',
  },
  {
    id: 2,
    name: 'Workshop CSS',
  },
  {
    id: 3,
    name: 'DevShare',
  },
  {
    id: 4,
    name: 'Summer Code',
  },
];

export const CertificateList: FC = () => (
  <List
    dataSource={sampleData}
    grid={{ gutter: 16, column: 3 }}
    renderItem={(item) => (
      <List.Item>
        <CertificateCard data={item} />
      </List.Item>
    )}
  />
);

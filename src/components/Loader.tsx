import { Spin } from 'antd';
import React, { FC } from 'react';

export const Loader: FC = () => (
  <Spin>
    <div style={{ width: '100%', height: '100vh' }}></div>
  </Spin>
);

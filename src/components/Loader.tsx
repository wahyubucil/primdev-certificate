import { Spin } from 'antd';
import React, { VFC } from 'react';

export const Loader: VFC = () => (
  <Spin>
    <div style={{ width: '100%', height: '100vh' }}></div>
  </Spin>
);

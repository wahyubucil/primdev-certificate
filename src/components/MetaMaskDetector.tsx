import React, { VFC } from 'react';
import { Alert, Button } from 'antd';
import { useMetaMask } from '@/hooks/useMetaMask';

interface Props {
  role?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const MetaMaskDetector: VFC<Props> = (props) => {
  const { error } = useMetaMask();

  if (!error) return null;

  return (
    <Alert
      {...props}
      type="warning"
      message={error.message}
      showIcon
      action={
        error.code === 'notInstalled' && (
          <Button
            size="small"
            type="link"
            href="https://metamask.io/download.html"
            target="_blank"
          >
            Install
          </Button>
        )
      }
    />
  );
};

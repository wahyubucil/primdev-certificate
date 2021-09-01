import React from 'react';
import { notification, Typography } from 'antd';

const { Text, Link } = Typography;

export function displayTransactionHash(
  title: string,
  hash: string,
  blockExplorerUrl?: string,
) {
  notification.success({
    message: title,
    duration: 0,
    description: (
      <>
        <div>Transaction Hash :</div>
        {blockExplorerUrl ? (
          <Link
            href={`${blockExplorerUrl}/tx/${hash}`}
            copyable
            target="_blank"
          >
            {hash}
          </Link>
        ) : (
          <Text copyable>{hash}</Text>
        )}
      </>
    ),
  });
}

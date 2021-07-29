import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Input, Space, Typography } from 'antd';
import React, { useEffect, useState, VFC } from 'react';

export const Participants: VFC = () => {
  const [changeMode, setChangeMode] = useState(false);
  const [participants, setParticipants] = useState<string[]>(['']);

  function onChangeName(value: string, idx: number) {
    let newParticipants = [...participants];
    newParticipants[idx] = value;

    // Filter empty
    newParticipants = newParticipants.filter((e) => e !== '');

    newParticipants.push('');

    setParticipants(newParticipants);
  }

  useEffect(() => {
    // It will not create more than one listener. See: https://stackoverflow.com/a/10364316
    const beforeUnloadListener = (e: BeforeUnloadEvent) => {
      if (changeMode) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', beforeUnloadListener);

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadListener);
    };
  }, [changeMode]);

  return (
    <>
      <Space style={{ marginTop: 24 }}>
        <Typography.Text strong>
          Participants ({participants.filter((e) => e !== '').length})
        </Typography.Text>
        <Button
          icon={changeMode ? <CheckOutlined /> : <EditOutlined />}
          size="small"
          onClick={() => setChangeMode(!changeMode)}
          type={changeMode ? 'primary' : 'default'}
        >
          {changeMode ? 'Save' : 'Change'}
        </Button>
      </Space>
      <div style={{ marginTop: 8 }}>
        <Space direction="vertical" style={{ display: 'flex' }}>
          {participants.map((participant, idx) => (
            <Input
              placeholder="Participant Name"
              key={idx}
              value={participant}
              readOnly={!changeMode}
              onChange={(e) => onChangeName(e.target.value, idx)}
            />
          ))}
        </Space>
      </div>
    </>
  );
};

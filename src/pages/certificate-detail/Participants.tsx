import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Input, message, Space, Typography } from 'antd';
import type { MessageType } from 'antd/lib/message';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState, VFC } from 'react';
import { Prompt } from 'react-router-dom';

interface ParticipantsProps {
  code: number;
  data: string[];
  revoked: boolean;
}

export const Participants: VFC<ParticipantsProps> = ({
  code,
  data,
  revoked,
}) => {
  const [changeMode, setChangeMode] = useState(false);
  const [participants, setParticipants] = useState([...data, '']);
  const nonEmptyParticipants = participants.filter((e) => e !== '');

  function onChangeName(value: string, idx: number) {
    let newParticipants = [...participants];
    newParticipants[idx] = value;

    // Filter empty
    newParticipants = newParticipants.filter((e) => e !== '');

    newParticipants.push('');

    setParticipants(newParticipants);
  }

  const hideMessage = useRef<MessageType>();
  useEffect(() => {
    if (changeMode)
      hideMessage.current = message.info("Don't forget to save changes!", 0);
    else hideMessage.current?.();

    // It will not create more than one listener. See: https://stackoverflow.com/a/10364316
    const beforeUnloadListener = (e: BeforeUnloadEvent) => {
      if (changeMode) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', beforeUnloadListener);

    return () => {
      if (hideMessage.current) hideMessage.current();
      window.removeEventListener('beforeunload', beforeUnloadListener);
    };
  }, [changeMode]);

  const [saveLoading, setSaveLoading] = useState(false);
  const db = getFirestore();
  async function save() {
    if (changeMode) {
      setSaveLoading(true);
      const docRef = doc(db, 'certificates', code.toString());
      await updateDoc(docRef, { participants: nonEmptyParticipants });
      setSaveLoading(false);
    }

    setChangeMode(!changeMode);
  }

  return (
    <>
      <Space style={{ marginTop: 24 }}>
        <Typography.Text strong>
          Participants ({nonEmptyParticipants.length})
        </Typography.Text>
        {!revoked && (
          <Button
            icon={changeMode ? <CheckOutlined /> : <EditOutlined />}
            size="small"
            loading={saveLoading}
            onClick={() => save()}
            type={changeMode ? 'primary' : 'default'}
          >
            {changeMode ? 'Save' : 'Change'}
          </Button>
        )}
      </Space>
      <div style={{ marginTop: 8 }}>
        <Space direction="vertical" style={{ display: 'flex' }}>
          {(changeMode ? participants : nonEmptyParticipants).map(
            (participant, idx) => (
              <Input
                placeholder="Participant Name"
                key={idx}
                value={participant}
                readOnly={!changeMode}
                onChange={(e) => onChangeName(e.target.value, idx)}
              />
            ),
          )}
        </Space>
      </div>
      <Prompt
        when={changeMode}
        message="You have unsaved changes. Are you sure want to leave?"
      />
    </>
  );
};

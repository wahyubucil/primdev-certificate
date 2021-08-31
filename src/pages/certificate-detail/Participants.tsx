import React, { useEffect, useRef, useState, VFC } from 'react';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Input, message, Space, Typography } from 'antd';
import type { MessageType } from 'antd/lib/message';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
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

  const initialData = [...data, ''];
  const [participants, setParticipants] = useState(initialData);
  const nonEmptyParticipants = participants.filter((e) => e !== '');

  function onChangeName(value: string, idx: number) {
    let newParticipants = [...participants];
    newParticipants[idx] = value;

    // Filter empty
    newParticipants = newParticipants.filter((e) => e !== '');

    newParticipants.push('');

    setParticipants(newParticipants);
  }

  function onPaste(event: React.ClipboardEvent<HTMLInputElement>, idx: number) {
    event.preventDefault();

    const leftParticipants = participants.slice(0, idx);

    const rightIndex = idx + 1;
    const rightParticipants =
      rightIndex === participants.length
        ? ['']
        : participants.slice(rightIndex);

    const pastedText = event.clipboardData.getData('text');
    const [firstValue, ...otherValues] = pastedText.split('\n');
    const currentIndexValue = participants[idx] + firstValue;

    const newParticipants = [
      ...leftParticipants,
      currentIndexValue,
      ...otherValues,
      ...rightParticipants,
    ];
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

  function cancel() {
    setParticipants(initialData);
    setChangeMode(false);
  }

  const [saveLoading, setSaveLoading] = useState(false);
  const db = getFirestore();
  async function save() {
    setSaveLoading(true);
    const docRef = doc(db, 'certificates', code.toString());
    await updateDoc(docRef, { participants: nonEmptyParticipants });
    setSaveLoading(false);
    setChangeMode(false);
  }

  return (
    <>
      <Space style={{ marginTop: 24 }}>
        <Typography.Text strong>
          Participants ({nonEmptyParticipants.length})
        </Typography.Text>
        {!revoked && changeMode && (
          <>
            <Button
              icon={<CloseOutlined />}
              size="small"
              danger
              type="primary"
              onClick={cancel}
              disabled={saveLoading}
            >
              Cancel
            </Button>
            <Button
              icon={<CheckOutlined />}
              size="small"
              loading={saveLoading}
              onClick={save}
              type="primary"
            >
              Save
            </Button>
          </>
        )}
        {!revoked && !changeMode && (
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => setChangeMode(true)}
            type="default"
          >
            Change
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
                onPaste={(e) => onPaste(e, idx)}
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

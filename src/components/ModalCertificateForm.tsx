import React, { useState, VFC } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, InputNumber, message, Modal } from 'antd';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import { DatePicker } from './DatePicker';
import dayjs, { Dayjs } from 'dayjs';

interface Values {
  code: number;
  name: string;
  expiredAt?: Dayjs;
}

interface FuncProps {
  data?: Values;
  onSuccess?: (values: Values) => void;
  onCancel?: () => void;
}

interface ModalProps extends FuncProps {
  visible: boolean;
  afterClose?: () => void;
}

interface ModalCertificateFormInterface extends VFC<ModalProps> {
  show: typeof show;
}

export const ModalCertificateForm: ModalCertificateFormInterface = ({
  visible,
  afterClose,
  data,
  onCancel,
  onSuccess,
}) => {
  const isEdit = data !== undefined;
  const [loading, setLoading] = useState(false);

  function disabledDate(current: Dayjs) {
    return current.isSameOrBefore(dayjs());
  }

  const db = getFirestore();
  async function onFinish(values: Values) {
    setLoading(true);

    // Check if there is a certificate with the same code
    const q = query(
      collection(db, 'certificates'),
      where('code', '==', values.code),
      limit(1),
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      message.error('Code is already used!');
      setLoading(false);
      return;
    }

    await addDoc(collection(db, 'certificates'), {
      code: values.code,
      name: values.name,
      expiredAt: values.expiredAt
        ? Timestamp.fromDate(values.expiredAt.toDate())
        : null,
      createdAt: serverTimestamp(),
      participants: [],
    });
    setLoading(false);
    message.success(`Certificate ${isEdit ? 'updated' : 'created'}`);
    if (onSuccess) onSuccess(values);
  }

  return (
    <Modal
      visible={visible}
      title={isEdit ? 'Edit certificate' : 'Create a new certificate'}
      okText={isEdit ? 'Update' : 'Create'}
      cancelText="Cancel"
      onCancel={loading ? undefined : onCancel}
      okButtonProps={{ htmlType: 'submit', form: 'form_certificate' }}
      afterClose={afterClose}
      confirmLoading={loading}
    >
      <Form
        layout="vertical"
        name="form_certificate"
        requiredMark="optional"
        onFinish={onFinish}
      >
        <Form.Item name="code" label="Code" rules={[{ required: true }]}>
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="expiredAt" label="Expired">
          <DatePicker format="DD MMM YYYY" disabledDate={disabledDate} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

ModalCertificateForm.show = show;

function show(config: FuncProps = {}) {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const defaultConfig: ModalProps = {
    visible: true,
    onSuccess: (values) => {
      close();
      if (config.onSuccess) config.onSuccess(values);
    },
    onCancel: () => {
      close();
      if (config.onCancel) config.onCancel();
    },
    afterClose: () => {
      // Destroy
      const unmountResult = ReactDOM.unmountComponentAtNode(div);
      if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div);
      }
    },
  };

  function render(props: ModalProps) {
    // Sync render blocks React event. Let's make this async.
    setTimeout(() => {
      ReactDOM.render(<ModalCertificateForm {...props} />, div);
    });
  }

  function close() {
    render({ ...defaultConfig, visible: false });
  }

  render(defaultConfig);

  return close;
}

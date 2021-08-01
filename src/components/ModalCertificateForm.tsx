import React, { VFC } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, InputNumber, Modal } from 'antd';
import { DatePicker } from './DatePicker';
import dayjs, { Dayjs } from 'dayjs';

interface Values {
  code: number;
  name: string;
  expiredAt: Date;
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
}) => {
  function disabledDate(current: Dayjs) {
    return current.isSameOrBefore(dayjs());
  }

  return (
    <Modal
      visible={visible}
      title={data ? 'Edit certificate' : 'Create a new certificate'}
      okText={data ? 'Update' : 'Create'}
      cancelText="Cancel"
      onCancel={onCancel}
      okButtonProps={{ htmlType: 'submit', form: 'form_certificate' }}
      afterClose={afterClose}
    >
      <Form
        layout="vertical"
        name="form_certificate"
        requiredMark="optional"
        onFinish={console.log}
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

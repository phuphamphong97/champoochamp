import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

import { typeForm } from '../../../../../../shared/constants';
import { formatDateTime } from '../../../../../../shared/util';
import { ModifyText } from '../../../../styledUtils';

class ColorForm extends Component {
  render() {
    const {
      isShowModal,
      currentTypeForm,
      title,
      form,
      color,
      onSave,
      onCancel
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title={title}
        visible={isShowModal}
        onOk={onSave}
        onCancel={onCancel}
      >
        <Form>
          {currentTypeForm === typeForm.update && (
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('id', {
                initialValue: color && color.id
              })(<Input placeholder="Id" />)}
            </Form.Item>
          )}
          <Form.Item label="Màu">
            {getFieldDecorator('name', {
              initialValue: color && color.name
            })(<Input placeholder="Màu" />)}
          </Form.Item>
          <Form.Item label="Mã màu">
            {getFieldDecorator('code', {
              initialValue: color && color.code,
              rules: [{ required: true, message: 'Vui lòng nhập mã màu!' }]
            })(<Input placeholder="Mã màu *" />)}
          </Form.Item>
          {currentTypeForm === typeForm.update &&
            color &&
            color.modifiedBy && (
              <ModifyText>
                Cập nhật lần cuối bởi {color.modifiedBy} lúc{' '}
                {formatDateTime(color.modifiedDate)}.
              </ModifyText>
            )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'ColorForm' })(ColorForm);

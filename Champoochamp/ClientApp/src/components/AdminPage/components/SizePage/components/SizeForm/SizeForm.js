﻿import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

import { typeForm } from '../../../../../../shared/constants';
import { formatDateTime } from '../../../../../../shared/util';
import { ModifyText } from '../../../../styledUtils';

class SizeForm extends Component {
  render() {
    const {
      isShowModal,
      currentTypeForm,
      title,
      form,
      size,
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
                initialValue: size && size.id
              })(<Input placeholder="Id" />)}
            </Form.Item>
          )}
          <Form.Item label="Kích thước">
            {getFieldDecorator('name', {
              initialValue: size && size.name,
              rules: [{ required: true, message: 'Vui lòng nhập kích thước!' }]
            })(<Input placeholder="Kích thước *" />)}
          </Form.Item>
          {currentTypeForm === typeForm.update &&
            size &&
            size.modifiedBy && (
              <ModifyText>
                Cập nhật lần cuối bởi {size.modifiedBy} lúc{' '}
                {formatDateTime(size.modifiedDate)}.
              </ModifyText>
            )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'SizeForm' })(SizeForm);

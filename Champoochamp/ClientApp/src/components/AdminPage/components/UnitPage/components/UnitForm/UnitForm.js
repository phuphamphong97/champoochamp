import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

import { typeForm } from '../../../../../../shared/constants';
import { formatDateTime } from '../../../../../../shared/util';
import { ModifyText } from '../../../../styledUtils';

class UnitForm extends Component {
  render() {
    const {
      isShowModal,
      currentTypeForm,
      title,
      form,
      unit,
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
              {getFieldDecorator('id', { initialValue: unit && unit.id })}
            </Form.Item>
          )}
          <Form.Item label="Tên">
            {getFieldDecorator('name', {
              initialValue: unit && unit.name,
              rules: [{ required: true, message: 'Vui lòng nhập đơn vị tính!' }]
            })(<Input placeholder="Tên *" />)}
          </Form.Item>
          {currentTypeForm === typeForm.update && unit && unit.modifiedBy && (
            <ModifyText>
              Cập nhật lần cuối bởi {unit.modifiedBy} lúc{' '}
              {formatDateTime(unit.modifiedDate)}.
            </ModifyText>
          )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'UnitForm' })(UnitForm);

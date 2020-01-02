import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

import { typeForm } from '../../../../../../shared/constants';

class UnitForm extends Component {
  render() {
    const { isShowModal, currentTypeForm, title, form, unit, onSave, onCancel } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title={title}
        visible={isShowModal}
        onOk={onSave}
        onCancel={onCancel}
      >
        <Form>
          {
            currentTypeForm === typeForm.update &&
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('id', { initialValue: unit && unit.id })}
            </Form.Item>
          }
          <Form.Item label="Tên đơn vị tính">
            {getFieldDecorator('name', {
              initialValue: unit && unit.name,
              rules: [{ required: true, message: 'Vui lòng nhập đơn vị tính!' }]
            })(<Input placeholder="Đơn vị tính *" />)}
          </Form.Item>
          {
            currentTypeForm === typeForm.update && unit && unit.modifiedBy &&
            <Form.Item label="Mã nhân viên cập nhật lần cuối">
              {getFieldDecorator('modifiedBy', { initialValue: unit.modifiedBy })(
                <Input readOnly />
              )}
            </Form.Item>
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'UnitForm' })(UnitForm);
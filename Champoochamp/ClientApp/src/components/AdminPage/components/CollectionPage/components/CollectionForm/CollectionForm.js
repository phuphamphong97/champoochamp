import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

import { typeForm } from '../../../../../../shared/constants';
import Avatar from '../../../../../elements/Avatar';

class CollectionForm extends Component {
  render() {
    const { getAvatarInfo, isShowModal, currentTypeForm, title, form, collection, onSave, onCancel } = this.props;
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
              {getFieldDecorator('id', { initialValue: collection && collection.id })}
            </Form.Item>
          }
          <Form.Item label="Tên bộ sưu tập">
            {getFieldDecorator('name', {
              initialValue: collection && collection.name,
              rules: [{ required: true, message: 'Vui lòng nhập tên bộ sưu tập!' }]
            })(<Input placeholder="Tên bộ sưu tập *" />)}
          </Form.Item>
          <Form.Item label="Ảnh bộ sưu tập">
            {getFieldDecorator('avatar')(<Avatar getAvatarInfo={getAvatarInfo} />)}
          </Form.Item>
          {
            currentTypeForm === typeForm.update && collection && collection.modifiedBy &&
            <Form.Item label="Nhân viên cập nhật lần cuối">
              {getFieldDecorator('modifiedBy', { initialValue: collection.modifiedBy })(
                <Input readOnly />
              )}
            </Form.Item>
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'CollectionForm' })(CollectionForm);
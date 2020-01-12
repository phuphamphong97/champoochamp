import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';

import { typeForm } from '../../../../../../shared/constants';
import { callAPI, formatDateTime } from '../../../../../../shared/util';
import { ModifyText } from '../../../../styledUtils';

const { Option } = Select;

class CategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentCategoryList: []
    };
  }

  getAllParentCategories = () => {
    callAPI('Category/GetAllParentCategories').then(res => {
      if (res.data) {
        this.setState({ parentCategoryList: res.data ? res.data : [] })
      }
    });
  };

  handleParentCategoryChange = value => {
    this.props.form.setFieldsValue({
      parentId: value.id
    });
  };

  render() {
    const { parentCategoryList } = this.state;
    const {
      isShowModal,
      currentTypeForm,
      title,
      form,
      category,
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
                initialValue: category && category.id
              })(<Input placeholder="Id" />)}
            </Form.Item>
          )}
          <Form.Item label="Tên">
            {getFieldDecorator('code', {
              initialValue: category && category.name,
              rules: [{ required: true, message: 'Vui lòng nhập tên!' }]
            })(<Input placeholder="Tên *" />)}
          </Form.Item>
          <Form.Item label="Nhóm loại sản phẩm">
                  {getFieldDecorator('parentId', {
                    initialValue: category ? category.parent.name : undefined,
                    rules: [
                      {
                        required: true,
                        message: 'Vui lòng chọn nhóm loại sản phẩm!'
                      }
                    ],
                    onChange: this.handleParentCategoryChange
                  })(
                    <Select showSearch placeholder="Nhóm loại sản phẩm *">
                      {parentCategoryList.map(parentCategory => (
                        <Option key={parentCategory.id}>{parentCategory.name}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
          {currentTypeForm === typeForm.update &&
            category &&
            category.modifiedBy && (
              <ModifyText>
                Cập nhật lần cuối bởi {category.modifiedBy} lúc{' '}
                {formatDateTime(category.modifiedDate)}.
              </ModifyText>
            )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'CategoryForm' })(CategoryForm);

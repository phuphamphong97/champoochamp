import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import styled from '@emotion/styled';

import { colors } from '../../../../../../shared/principles';
import { formatDateTime, formatMoney } from '../../../../../../shared/util';
import { cities, districts, wards } from '../../../../../../shared/address';

const ModifyText = styled('span')`
  color: ${colors.darkGray};
  font-size: 12px;
`;

const { Option } = Select;

class InvoiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      districtsData: props.invoice ? districts[props.invoice.customerProvince] : [],
      wardsData: props.invoice ? wards[props.invoice.customerDistrict] : []
    };
  }

  componentDidMount() {
    const { form, invoice } = this.props;
    if (invoice) {
      this.handleDistrictChange(form.getFieldsValue().customerDistrict)
    }
  }

  handleCityChange = value => {
    this.props.form.setFieldsValue({
      customerDistrict: undefined,
      customerWard: undefined
    });

    this.setState({
      districtsData: districts[value],
      wardsData: []
    });
  };

  handleDistrictChange = value => {
    this.props.form.setFieldsValue({
      customerWard: undefined
    });

    this.setState({
      wardsData: wards[value]
    });
  };

  render() {
    const { districtsData, wardsData } = this.state;
    const { isShowModal, form, invoice, onCancel, invoiceStatus } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title="Thông tin hóa đơn"
        visible={isShowModal}
        onCancel={onCancel}
      >
        <Form>
          {
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('id', { initialValue: invoice && invoice.id })(
                <Input placeholder="Id" />
              )}
            </Form.Item>
          }
          <Form.Item label="Tên">
            {getFieldDecorator('customerName', {
              initialValue: invoice && invoice.customerName,
              rules: [{ required: true, message: 'Vui lòng nhập tên!' }]
            })(<Input placeholder="Họ tên *" />)}
          </Form.Item>
          <Form.Item label="Email">
            {getFieldDecorator('customerEmail', {
              initialValue: invoice && invoice.customerEmail,
              rules: [{ required: true, message: 'Vui lòng nhập email!' }]
            })(<Input placeholder="Email *" />)}
          </Form.Item>
          <Form.Item label="Số điện thoại">
            {getFieldDecorator('customerPhone', {
              initialValue: invoice && invoice.customerPhone,
              rules: [{ required: true, message: 'Vui lòng nhập số điện thoại!' }]
            })(
              <Input placeholder="Số điện thoại *" />
            )}
          </Form.Item>
          <Form.Item label="Tỉnh / thành phố">
            {getFieldDecorator('customerProvince', {
              initialValue: invoice ? invoice.customerProvince : undefined,
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn tỉnh / thành phố!'
                }
              ],
              onChange: this.handleCityChange
            })(
              <Select showSearch placeholder="Tỉnh / thành phố *">
                {cities.map(city => (
                  <Option key={city}>{city}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Quận / huyện">
            {getFieldDecorator('customerDistrict', {
              initialValue: invoice ? invoice.customerDistrict : undefined,
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn quận / huyện!'
                }
              ],
              onChange: this.handleDistrictChange
            })(
              <Select showSearch placeholder="Quận / huyện *">
                {districtsData.map(district => (
                  <Option key={district}>{district}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Phường / xã">
            {getFieldDecorator('customerWard', {
              initialValue: invoice ? invoice.customerWard : undefined,
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn phường / xã!'
                }
              ]
            })(
              <Select showSearch placeholder="Phường / xã *">
                {wardsData.map(ward => (
                  <Option key={ward}>{ward}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Số nhà, đường">
            {getFieldDecorator('customerAddress', {
              initialValue: invoice ? invoice.customerAddress : undefined,
              rules: [{ required: true, message: 'Vui lòng nhập số nhà, đường!' }]
            })(<Input placeholder="Số nhà, đường *" />)}
          </Form.Item>
          <Form.Item label="Lời nhắn">
            {getFieldDecorator('message', { initialValue: invoice && invoice.message })(
              <Input placeholder="Lời nhắn" />
            )}
          </Form.Item>
          <Form.Item label="Trạng thái">
            {getFieldDecorator('status', {
              initialValue: invoice ? invoice.status : undefined,
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn trạng thái!'
                }
              ]
            })(
              <Select showSearch placeholder="Trạng thái *">
                {invoiceStatus.map(status => (
                  <Option value={status.name}>{status.name}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {
            invoice && invoice.modifiedBy &&
            (
              <ModifyText>
                Cập nhật lần cuối bởi {invoice.modifiedBy} lúc{' '}
                {formatDateTime(invoice.modifiedDate)}.
              </ModifyText>
            )
          }
          {
            invoice && invoice.ShipMoney &&
            (
              <ModifyText>
                Phí vận chuyển {formatMoney(invoice.shipMoney, true)}đ
              </ModifyText>
            )
          }
          {
            invoice && invoice.discountCode && invoice.discountAmount &&
            (
              <ModifyText>
                Mã giảm giá {invoice.discountCode} với mức giảm {invoice.discountAmount}%
              </ModifyText>
            )
          }
          {
            invoice &&
            (
              <ModifyText>
                Tổng tiền {formatMoney(invoice.total, true)}đ
              </ModifyText>
            )
          }
          {
            invoice && invoice.paymentMethod &&
            (
              <ModifyText>
                Phương thức thanh toán {invoice.paymentMethod}
              </ModifyText>
            )
          }          
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'InvoiceForm' })(InvoiceForm);
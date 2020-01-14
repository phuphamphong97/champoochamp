import React, { Component } from 'react';
import { Modal, Form, Input, Select, Table, Button, Icon } from 'antd';
import styled from '@emotion/styled';

import { colors } from '../../../../../../shared/principles';
import { callAPI, formatDateTime, formatMoney } from '../../../../../../shared/util';
import { cities, districts, wards } from '../../../../../../shared/address';

const TextRow = styled('div')`
  color: ${colors.black};
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const LeftText = styled('span')`
  margin-right: 10px;
`;

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
      wardsData: props.invoice ? wards[props.invoice.customerDistrict] : [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      isInvoiceIdChange: false,
      invoice: props.invoice,
      invoiceDetailList: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.invoice !== prevState.invoice) {
      return {
        invoice: nextProps.invoice,
        isInvoiceIdChange: true
      };
    }

    return null;
  }

  componentDidUpdate() {
    const { isInvoiceIdChange, invoice } = this.state;

    isInvoiceIdChange && this.getAllInvoiceDetailsByInvoiceId(invoice.id);
  }

  componentDidMount() {
    const { invoice } = this.state;
    const { form } = this.props;
    invoice && this.handleDistrictChange(form.getFieldsValue().customerDistrict)
  }

  getAllInvoiceDetailsByInvoiceId = invoiceId => {
    callAPI(`Invoice/GetAllInvoiceDetailsByInvoiceId-${invoiceId}`)
      .then(res => this.setState({
        isInvoiceIdChange: false,
        invoiceDetailList: res.data
      }));
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

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter
    });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => text
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    let { districtsData, wardsData, sortedInfo, invoiceDetailList, invoice  } = this.state;
    const { isShowModal, form, onCancel, onUpdateDetailInfo, invoiceStatus } = this.props;
    const { getFieldDecorator } = form;
    sortedInfo = sortedInfo || {};

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: '10%',
        ...this.getColumnSearchProps('id'),
        sorter: (a, b) => a.id.toString().localeCompare(b.id),
        sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
        ellipsis: true
      },
      {
        title: 'Sản phẩm',
        dataIndex: 'productVariant.product.name',
        width: '35%',
        ...this.getColumnSearchProps('productVariant.product.name'),
        sorter: (a, b) => a.productVariant.product.name.localeCompare(b.productVariant.product.name),
        sortOrder: sortedInfo.columnKey === 'productVariant.product.name' && sortedInfo.order,
        ellipsis: true
      },
      {
        title: 'Giá',
        dataIndex: 'priceCurrent',
        width: '20%',
        ...this.getColumnSearchProps('priceCurrent'),
        sorter: (a, b) => a.priceCurrent.toString().localeCompare(b.priceCurrent),
        sortOrder: sortedInfo.columnKey === 'priceCurrent' && sortedInfo.order,
        render: (text, record) => (<span>{formatMoney(record.priceCurrent, true)}đ</span>),
      },
      {
        title: 'SL',
        dataIndex: 'quantity',
        width: '15%',
        ...this.getColumnSearchProps('quantity'),
        sorter: (a, b) => a.quantity.toString().localeCompare(b.quantity),
        sortOrder: sortedInfo.columnKey === 'quantity' && sortedInfo.order,
        ellipsis: true
      },      
      {
        title: 'Thành tiền',
        dataIndex: 'total',
        width: '20%',
        ...this.getColumnSearchProps('total'),
        sorter: (a, b) => a.total.toString().localeCompare(b.total),
        sortOrder: sortedInfo.columnKey === 'total' && sortedInfo.order,
        render: (text, record) => (
          <span>{formatMoney(record.total, true)}đ</span>
        )
      },      
    ];

    return (
      <Modal
        title="Thông tin hóa đơn"
        visible={isShowModal}
        onOk={onUpdateDetailInfo}
        onCancel={onCancel}
        width="800px"
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
          <Form.Item label="Phương thức thanh toán">
            {getFieldDecorator('paymentMethod', {
              initialValue: invoice ? invoice.paymentMethod : undefined,
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn phương thức thanh toán!'
                }
              ]
            })(
              <Select showSearch placeholder="Phương thức thanh toán *">
                <Option key="COD">COD</Option>
                <Option key="Banking">Banking</Option>
              </Select>
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
                  <Option key={status.name}>{status.name}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {
            invoice && invoice.ShipMoney &&
            (
              <TextRow>
                <LeftText>
                  Phí vận chuyển: {formatMoney(invoice.shipMoney, true)}đ
                </LeftText>
              </TextRow>              
            )
          }
          {
            invoice && invoice.discountCode && invoice.discountAmount &&
            (
              <TextRow>
                <LeftText>
                  Áp dụng mã giảm giá: {invoice.discountCode} với mức giảm {invoice.discountAmount}%
                </LeftText>
              </TextRow>               
            )
          }
          {
            invoice &&
            (
              <TextRow>
                <LeftText>
                  Tổng tiền: {formatMoney(invoice.total, true)}đ
                </LeftText>
              </TextRow>              
            )
          }
          <div>
            <Table
              rowKey='id'
              columns={columns}
              dataSource={invoiceDetailList}
              onChange={this.handleChange}
            />
          </div>
          {
            invoice && invoice.modifiedBy &&
            (
              <div>
                <ModifyText>
                  Cập nhật lần cuối bởi {invoice.modifiedBy} lúc{' '}
                  {formatDateTime(invoice.modifiedDate)}.
                </ModifyText>
              </div>
            )
          }
        </Form>        
      </Modal>
    );
  }
}

export default Form.create({ name: 'InvoiceForm' })(InvoiceForm);
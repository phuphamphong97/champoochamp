import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Table, Input, Button, Select, Icon, notification } from 'antd';

import { callAPI, getArrByMap, formatMoney } from '../../../../shared/utils';
import { time } from '../../../../shared/constants';
import { ButtonsWrapper, ActionButton, LinkButton } from '../../styledUtils';

const { Option } = Select;

class InvoicePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      invoiceList: [],
      isEdit: false
    };
    this.mapCheckInvoice = new Map();
  }

  componentDidMount() {
    this.getAllInvoices();
  }

  getAllInvoices = () => {
    callAPI('Invoice/GetAllInvoices').then(res =>
      this.setState({ invoiceList: res.data })
    );
  };

  onEdit = () => {
    this.setState({ isEdit: true });
  };

  onSave = () => {
    const { employee } = this.props;
    const data = {
      employee,
      invoiceList: getArrByMap(this.mapCheckInvoice)
    };

    callAPI('Invoice/UpdateInvoices', '', 'POST', data).then(res => {
      this.mapCheckInvoice = new Map();

      if (res.data) {
        this.setState({
          invoiceList: res.data,
          isEdit: false
        });
        notification.info({
          message: 'Sửa hóa đơn thành công!',
          placement: 'topRight',
          onClick: () => notification.destroy(),
          duration: time.durationNotification
        });
      } else {
        this.setState({
          isEdit: false
        });
        notification.warning({
          message: 'Sửa hóa đơn thất bại!',
          placement: 'topRight',
          onClick: () => notification.destroy(),
          duration: time.durationNotification
        });
      }
    });
  };

  onRollBack = () => {
    this.setState({
      isEdit: false
    });
    this.mapCheckInvoice = new Map();
  };

  onChangeStatus = (invoice, value) => {
    const { mapCheckInvoice } = this;
    mapCheckInvoice.set(invoice.id, value);
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter
    });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
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
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
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
      searchedColumn: dataIndex
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    let { sortedInfo, invoiceList, isEdit } = this.state;
    sortedInfo = sortedInfo || {};

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: '10%',
        ...this.getColumnSearchProps('id'),
        sorter: (a, b) => a.id.localeCompare(b.id),
        sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
        ellipsis: true,
        render: (text, record) => (
          <LinkButton type="link">{record.id}</LinkButton>
        )
      },
      {
        title: 'Họ tên KH',
        dataIndex: 'customerName',
        width: '20%',
        ...this.getColumnSearchProps('customerName'),
        sorter: (a, b) => a.customerName.localeCompare(b.customerName),
        sortOrder: sortedInfo.columnKey === 'customerName' && sortedInfo.order,
        ellipsis: true
      },
      {
        title: 'SĐT',
        dataIndex: 'customerPhone',
        width: '15%',
        ...this.getColumnSearchProps('customerPhone'),
        sorter: (a, b) => a.customerPhone.localeCompare(b.customerPhone),
        sortOrder: sortedInfo.columnKey === 'customerPhone' && sortedInfo.order,
        ellipsis: true
      },
      {
        title: 'Thời gian đặt hàng',
        dataIndex: 'createdDate',
        width: '25%',
        ...this.getColumnSearchProps('createdDate'),
        sorter: (a, b) =>
          moment(a.createdDate).unix() - moment(b.createdDate).unix(),
        sortOrder: sortedInfo.columnKey === 'createdDate' && sortedInfo.order,
        render: (text, record) => (
          <span>
            {moment(record.createdDate).format('DD/MM/YYYY HH:mm:ss')}
          </span>
        )
      },
      {
        title: 'Tổng tiền',
        dataIndex: 'total',
        width: '15%',
        ...this.getColumnSearchProps('total'),
        sorter: (a, b) => a.total - b.total,
        sortOrder: sortedInfo.columnKey === 'total' && sortedInfo.order,
        render: (text, record) => (
          <span>{formatMoney(record.total, true)}đ</span>
        )
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: '15%',
        ...this.getColumnSearchProps('status'),
        sorter: (a, b) => a.status.localeCompare(b.status),
        sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
        render: (text, record) => (
          <Fragment>
            {isEdit ? (
              <Select
                style={{ width: 150 }}
                defaultValue={record.status}
                onChange={val => this.onChangeStatus(record, val)}
              >
                <Option value="Đã thanh toán">Đã thanh toán</Option>
                <Option value="Đang giao hàng">Đang giao hàng</Option>
                <Option value="Chưa thanh toán">Chưa thanh toán</Option>
                <Option value="Đã hủy">Đã hủy</Option>
                <Option value="Lỗi đặt hàng">Lỗi đặt hàng</Option>
              </Select>
            ) : (
              <span>{record.status}</span>
            )}
          </Fragment>
        )
      }
    ];

    return (
      <Fragment>
        <ButtonsWrapper>
          {isEdit ? (
            <Fragment>
              <ActionButton type="primary" onClick={this.onSave}>
                Lưu
              </ActionButton>
              <ActionButton type="default" onClick={this.onRollBack}>
                Hủy
              </ActionButton>
            </Fragment>
          ) : (
            <ActionButton type="primary" onClick={this.onEdit}>
              Chỉnh sửa
            </ActionButton>
          )}
        </ButtonsWrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={invoiceList}
          onChange={this.handleChange}
        />
      </Fragment>
    );
  }
}

export default InvoicePage;

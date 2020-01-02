import React, { Component, Fragment } from 'react';
import { Table, Input, Button, Select, Icon, notification } from 'antd';

import { callAPI, getArrByMap, formatMoney } from '../../../../shared/utils';
import { time } from '../../../../shared/constants';
import { Link } from '../../../elements';

const { Option } = Select;

class InvoicePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
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
    callAPI('Invoice/GetAllInvoices')
      .then(res => this.setState({ invoiceList: res.data }));
  }

  onEdit = () => {
    this.setState({ isEdit: true })
  }

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
          selectedRowKeys: [],
          invoiceList: res.data,
          isEdit: false
        });
        notification.info({
          message: 'Sửa hóa đơn thành công!',
          placement: 'topRight',
          onClick: () => notification.destroy(),
          duration: time.durationNotification,
        });
      }
      else {
        this.setState({
          selectedRowKeys: [],
          isEdit: false
        });
        notification.warning({
          message: 'Sửa hóa đơn thất bại!',
          placement: 'topRight',
          onClick: () => notification.destroy(),
          duration: time.durationNotification,
        });
      }  
    });    
  }

  onRollBack = () => {
    this.setState({
      selectedRowKeys: [],
      isEdit: false
    })
    this.mapCheckInvoice = new Map();
  }

  onChangeStatus = (invoice, value) => {
    const { mapCheckInvoice } = this;
    
    mapCheckInvoice.set(invoice.id, value);
    this.setState({ selectedRowKeys: Array.from(mapCheckInvoice.keys()) })
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
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
    let { selectedRowKeys, sortedInfo, invoiceList, isEdit } = this.state;    
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    sortedInfo = sortedInfo || {};    

    const columns = [
      {
        title: 'Tên khách hàng',
        dataIndex: 'customerName',
        width: '18%',
        ...this.getColumnSearchProps('customerName'),
        sorter: (a, b) => a.customerName.localeCompare(b.customerName),
        sortOrder: sortedInfo.columnKey === 'customerName' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'customerPhone',
        width: '17%',
        ...this.getColumnSearchProps('customerPhone'),
        sorter: (a, b) => a.customerPhone.localeCompare(b.customerPhone),
        sortOrder: sortedInfo.columnKey === 'customerPhone' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'customerAddress',
        width: '30%',
        ...this.getColumnSearchProps('customerAddress'),
        sorter: (a, b) => a.customerAddress.localeCompare(b.customerAddress),
        sortOrder: sortedInfo.columnKey === 'customerAddress' && sortedInfo.order,
        render: (text, record) => (
          <span>
            {record.customerAddress ? `${record.customerAddress}, ` : ``}
            {record.customerWard ? `${record.customerWard}, ` : ``}
            {record.customerDistrict ? `${record.customerDistrict}, ` : ``}
            {record.customerProvince ? `${record.customerProvince}` : ``}
          </span>
        ),
      },
      {
        title: 'Tổng tiền',
        dataIndex: 'total',
        width: '15%',
        ...this.getColumnSearchProps('total'),
        sorter: (a, b) => a.total - b.total,
        sortOrder: sortedInfo.columnKey === 'total' && sortedInfo.order,
        render: (text, record) => (<span>{formatMoney(record.total, true)}đ</span>),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: '20%',
        ...this.getColumnSearchProps('status'),
        sorter: (a, b) => a.status.localeCompare(b.status),
        sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
        render: (text, record) => (
          <Fragment>
            {
              isEdit ?
                <Select
                  style={{width: 150}}
                  defaultValue={record.status}
                  onChange={val => this.onChangeStatus(record, val)}
                >
                  <Option value="Đã thanh toán">Đã thanh toán</Option>
                  <Option value="Chưa thanh toán">Chưa thanh toán</Option>
                  <Option value="Đang giao hàng">Đang giao hàng</Option>
                  <Option value="Đã hủy">Đã hủy</Option>
                </Select>
                :
                <span>{record.status}</span>
            }
          </Fragment>
        ),
      },
    ];

    return (
      <div>
        {
          isEdit ?
            <Link onClick={this.onRollBack} content="Hủy" />
            :
            <Link onClick={this.onEdit} content="Chỉnh sửa" />
        }        
        <Link onClick={this.onSave} content="Lưu" />
        
        <Table
          rowKey='id'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={invoiceList}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default InvoicePage;

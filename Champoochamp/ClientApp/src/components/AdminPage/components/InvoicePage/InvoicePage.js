import React, { Component, Fragment } from 'react';
import { Table, Input, Button, Checkbox, Icon, notification } from 'antd';

import { callAPI } from '../../../../shared/utils';
import { time } from '../../../../shared/constants';
import { Link } from '../../../elements';


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
  }

  componentWillMount() {
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
    const arr = Array.from(this.mapCheckInvoice.keys());
    const data = {
      employee,
      invoiceIds: arr
    }

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

  changeStatus = invoice => {
    const { mapCheckInvoice } = this;
    if (mapCheckInvoice.has(invoice.id)) {
      mapCheckInvoice.delete(invoice.id);
    }
    else {
      mapCheckInvoice.set(invoice.id, '');
    }
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
        width: '20%',
        ...this.getColumnSearchProps('customerName'),
        sorter: (a, b) => a.customerName.length - b.customerName.length,
        sortOrder: sortedInfo.columnKey === 'customerName' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'customerPhone',
        width: '15%',
        ...this.getColumnSearchProps('customerPhone'),
        sorter: (a, b) => a.customerPhone - b.customerPhone,
        sortOrder: sortedInfo.columnKey === 'customerPhone' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'customerAddress',
        width: '30%',
        ...this.getColumnSearchProps('customerAddress'),
        sorter: (a, b) => a.customerAddress.length - b.customerAddress.length,
        sortOrder: sortedInfo.columnKey === 'customerAddress' && sortedInfo.order,
      },
      {
        title: 'Tổng tiền',
        dataIndex: 'total',
        width: '20%',
        ...this.getColumnSearchProps('total'),
        sorter: (a, b) => a.total - b.total,
        sortOrder: sortedInfo.columnKey === 'total' && sortedInfo.order,
      },
      {
        title: 'Trạng thái',
        width: '15%',
        render: (text, record) => (
          <Fragment>
            {
              isEdit ?
                <Checkbox onChange={() => this.changeStatus(record)} defaultChecked={record.status === 1 ? true : false} />
                :
                record.status === 1 ? <span>Đã thanh toán</span> : <span>Chưa thanh toán</span>
            }
          </Fragment>
        ),
      },
    ];

    return (
      <div>
        <Link onClick={this.onEdit} content="Chỉnh sửa" />
        <Link onClick={this.onSave} content="Lưu" />
        <Link onClick={this.onRollBack} content="Thay đổi trở lại" />
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

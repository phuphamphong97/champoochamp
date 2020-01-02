import React, { Component } from 'react';
import { Table, Input, Button, Icon } from 'antd';

import { callAPI, getImageUrl } from '../../../../shared/utils';
import { imagesGroup } from '../../../../shared/constants';

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      userList: []
    };
  }

  componentDidMount() {
    this.getAllUsers();
  }

  getAllUsers = () => {
    callAPI('User/GetAllUsers')
      .then(res => this.setState({ userList: res.data }));
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
    let { selectedRowKeys, sortedInfo, userList } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    sortedInfo = sortedInfo || {};


    const columns = [
      {
        title: 'Avatar',
        width: '20%',
        render: (text, record) => (
          <img
            src={getImageUrl(record.avatar, imagesGroup.users)}
            alt=""
            style={{ width: "50px" }}
          />
        ),
      },
      {
        title: 'Tên nhân viên',
        dataIndex: 'name',
        width: '18%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: '16%',
        ...this.getColumnSearchProps('email'),
        sorter: (a, b) => a.email.localeCompare(b.email),
        sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phone',
        width: '16%',
        ...this.getColumnSearchProps('phone'),
        sorter: (a, b) => a.phone.localeCompare(b.phone),
        sortOrder: sortedInfo.columnKey === 'phone' && sortedInfo.order,
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'address',
        width: '30%',
        ...this.getColumnSearchProps('address'),
        sorter: (a, b) => a.address.localeCompare(b.address),
        sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
        render: (text, record) => (
          <span>
            {record.address ? `${record.address}, ` : ``}
            {record.address ? `${record.ward}, ` : ``}
            {record.address ? `${record.district}, ` : ``}
            {record.address ? `${record.province}` : ``}
          </span>
        ),
      },
    ];

    return (
      <div>
        <Table
          rowKey='id'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={userList}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default UserPage;

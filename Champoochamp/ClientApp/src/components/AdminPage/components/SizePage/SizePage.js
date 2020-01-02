import React, { Component } from 'react';
import moment from 'moment';
import { Table, Input, Button, Icon } from 'antd';

import { callAPI } from '../../../../shared/utils';

class SizePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      sizeList: []
    };
  }

  componentDidMount() {
    this.getAllSizes();
  }

  getAllSizes = () => {
    callAPI('Size/GetAllSizes')
      .then(res => this.setState({ sizeList: res.data }));
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
    let { selectedRowKeys, sortedInfo, sizeList } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    sortedInfo = sortedInfo || {};


    const columns = [
      {
        title: 'Kích thước',
        dataIndex: 'name',
        width: '20%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createDate',
        width: '80%',
        ...this.getColumnSearchProps('createDate'),
        sorter: (a, b) => moment(a.createDate).unix() - moment(b.createDate).unix(),
        sortOrder: sortedInfo.columnKey === 'createDate' && sortedInfo.order,
        render: (text, record) => (<span>{moment(record.createDate).format('DD/MM/YYYY')}</span>),
      },
    ];

    return (
      <div>
        <Table
          rowKey='id'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={sizeList}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default SizePage;

import React, { Component } from 'react';
import moment from 'moment';
import { Table, Input, Button, Icon } from 'antd';

import { callAPI, getImageUrl } from '../../../../shared/utils';
import { imagesGroup } from '../../../../shared/constants';

class CollectionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      collectionList: []
    };
  }

  componentDidMount() {
    this.getAllCollections();
  }

  getAllCollections = () => {
    callAPI('Collection/GetAllCollections')
      .then(res => this.setState({ collectionList: res.data }));
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
    let { selectedRowKeys, sortedInfo, collectionList } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    sortedInfo = sortedInfo || {};


    const columns = [
      {
        title: 'Ảnh sản phẩm',
        width: '20%',
        render: (text, record) => (
          <img
            src={getImageUrl(record.thumbnail, imagesGroup.collections)}
            alt=""
            style={{ width: "50px" }}
          />
        ),
      },
      {
        title: 'Tên bộ sưu tập',
        dataIndex: 'name',
        width: '30%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Độ ưu tiên hiển thị',
        dataIndex: 'displayOrder',
        width: '20%',
        ...this.getColumnSearchProps('displayOrder'),
        sorter: (a, b) => a.displayOrder - b.displayOrder,
        sortOrder: sortedInfo.columnKey === 'displayOrder' && sortedInfo.order,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createDate',
        width: '30%',
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
          dataSource={collectionList}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default CollectionPage;

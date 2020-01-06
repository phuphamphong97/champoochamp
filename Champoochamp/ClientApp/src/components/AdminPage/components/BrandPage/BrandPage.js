import React, { Component } from 'react';
import moment from 'moment';
import { Table, Input, Button, Icon } from 'antd';

import { callAPI, getImageUrl } from '../../../../shared/utils';
import { imagesGroup } from '../../../../shared/constants';

class BrandPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      brandList: []
    };
  }

  componentDidMount() {
    this.getAllBrands();
  }

  getAllBrands = () => {
    callAPI('Brand/GetAllBrands')
      .then(res => this.setState({ brandList: res.data }));
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
    let { selectedRowKeys, sortedInfo, brandList } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    sortedInfo = sortedInfo || {};


    const columns = [
      {
        title: 'Logo',
        width: '20%',
        render: (text, record) => (
          <img
            src={imagesGroup.logos && record.logo && getImageUrl(record.logo, imagesGroup.logos)}
            alt=""
            style={{ width: "50px" }}
          />
        ),
      },
      {
        title: 'Thương hiệu',
        dataIndex: 'name',
        width: '20%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Quốc gia',
        dataIndex: 'country',
        width: '30%',
        ...this.getColumnSearchProps('country'),
        sorter: (a, b) => a.country.localeCompare(b.country),
        sortOrder: sortedInfo.columnKey === 'country' && sortedInfo.order,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        width: '30%',
        ...this.getColumnSearchProps('createdDate'),
        sorter: (a, b) => moment(a.createdDate).unix() - moment(b.createdDate).unix(),
        sortOrder: sortedInfo.columnKey === 'createdDate' && sortedInfo.order,
        render: (text, record) => (<span>{moment(record.createdDate).format('DD/MM/YYYY')}</span>),
      },
    ];

    return (
      <div>
        <Table
          rowKey='id'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={brandList}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default BrandPage;

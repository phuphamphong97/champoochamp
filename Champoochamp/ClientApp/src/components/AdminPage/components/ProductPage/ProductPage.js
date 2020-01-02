import React, { Component } from 'react';
import { Table, Input, Button, Icon } from 'antd';

import { callAPI, formatMoney, getImageUrl } from '../../../../shared/utils';
import { imagesGroup } from '../../../../shared/constants';

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      productList: []
    };
  }

  componentDidMount() {
    this.getAllProducts();
  }

  getAllProducts = () => {
    callAPI('Product/GetAllProducts')
      .then(res => this.setState({ productList: res.data }));
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
    let { selectedRowKeys, sortedInfo, productList } = this.state;
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
            src={getImageUrl(record.productVariant[0].thumbnail, imagesGroup.products)}
            alt=""
            style={{ width: "50px" }}
          />
        ),
      },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        width: '20%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Giá gốc',
        dataIndex: 'price',
        width: '15%',
        ...this.getColumnSearchProps('price'),
        sorter: (a, b) => a.price - b.price,
        sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
        render: (text, record) => (<span>{formatMoney(record.price, true)}đ</span>),
      },
      {
        title: 'Khuyến mãi',
        dataIndex: 'discountAmount',
        width: '15%',
        ...this.getColumnSearchProps('discountAmount'),
        sorter: (a, b) => a.discountAmount - b.discountAmount,
        sortOrder: sortedInfo.columnKey === 'discountAmount' && sortedInfo.order,
        render: (text, record) => (<span>{record.discountAmount}%</span>),
      },
      {
        title: 'Tổng số lượng',
        dataIndex: 'totalQuantity',
        width: '20%',
        ...this.getColumnSearchProps('totalQuantity'),
        sorter: (a, b) => a.totalQuantity - b.totalQuantity,
        sortOrder: sortedInfo.columnKey === 'discountAmount' && sortedInfo.order,
      },      
    ];

    return (
      <div>
        <Table
          rowKey='id'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={productList}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default ProductPage;

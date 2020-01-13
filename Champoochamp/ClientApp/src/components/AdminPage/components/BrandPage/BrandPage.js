import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Table, Input, Button, Icon, Divider, notification } from 'antd';

import { callAPI, getImageUrl } from '../../../../shared/util';
import { imagesGroup, time, typeForm } from '../../../../shared/constants';
import { ButtonsWrapper, ActionButton, LinkButton } from '../../styledUtils';

import BrandForm from './components/BrandForm';

class BrandPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      brandList: [],
      isShowModal: false,
      title: '',
      brand: null,
      currentTypeForm: '',
      thumbnailBase64: ''
    };
  }

  componentDidMount() {
    this.getAllBrands();
  }

  getAllBrands = () => {
    callAPI('Brand/GetAllBrands')
      .then(res => this.setState({ brandList: res.data }));
  }

  getThumbnailBase64 = thumbnailBase64 => {
    this.setState({ thumbnailBase64 });
  }

  onShowModal = (typeForm, title, brand) => {
    this.setState({
      isShowModal: true,
      currentTypeForm: typeForm,
      title,
      brand
    });
  };

  onSave = () => {
    const { currentTypeForm, brandList, thumbnailBase64 } = this.state;
    const { employee } = this.props;
    const { form } = this.formRef.props;

    form.validateFields((err, values) => {
      const data = {
        employee,
        brand: values,
        thumbnailBase64,
        folderName: imagesGroup.logos,
        brandList: []
      }

      if (err) {
        return;
      }

      if (currentTypeForm === typeForm.create) {
        callAPI('Brand/CreateBrand', '', 'POST', values)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                brandList.push(res.data);

                this.setState({
                  isShowModal: false,
                  brandList,
                  thumbnailBase64: ''
                });
                form.resetFields();

                notification.info({
                  message: 'Tạo mới thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Thương hiệu đã tồn tại, vui lòng nhập thương hiệu khác!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
            }
            else {
              this.setState({
                isShowModal: false,
                thumbnailBase64: ''
              });
              form.resetFields();

              notification.warning({
                message: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
                placement: 'topRight',
                onClick: () => notification.destroy(),
                duration: time.durationNotification
              });
            }
          });
      }
      else if (currentTypeForm === typeForm.update) {
        callAPI('Brand/PutBrand', '', 'PUT', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                let lst = brandList;
                lst = brandList.filter(brand => brand.id !== res.data.id)
                lst.unshift(res.data);

                this.setState({
                  isShowModal: false,
                  brandList: lst,
                  thumbnailBase64: ''
                });
                form.resetFields();

                notification.info({
                  message: 'Cập nhật thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Thương hiệu đã tồn tại, vui lòng nhập thương hiệu khác!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
            }
            else {
              this.setState({
                isShowModal: false,
                thumbnailBase64: ''
              });
              form.resetFields();

              notification.warning({
                message: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
                placement: 'topRight',
                onClick: () => notification.destroy(),
                duration: time.durationNotification
              });
            }
          });
      }
    });
  };

  onCancel = () => {
    this.setState({
      isShowModal: false,
      thumbnailBase64: ''
    });
    this.formRef.props.form.resetFields();
  };

  onSelectedDelete = ids => {
    let brandList = [];
    ids.map(id => brandList.push({ id }));
    const data = {
      employee: null,
      brand: null,
      brandList
    };

    callAPI('Brand/DeleteBrandByIds', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => !ids.includes(key)),
            brandList: this.state.brandList.filter(brand => !ids.includes(brand.id))
          });

          notification.info({
            message: 'Xóa thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
      });
  };

  onDelete = id => {
    const data = { id };

    callAPI('Brand/DeleteBrandById', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
            brandList: this.state.brandList.filter(brand => brand.id !== id)
          });

          notification.info({
            message: 'Xóa thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
      });
  };

  wrappedComponentRef = formRef => {
    this.formRef = formRef;
  };

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
    let { selectedRowKeys, sortedInfo, brandList, isShowModal, currentTypeForm, title, brand, thumbnailBase64 } = this.state;
    const { handleChange, onSelectChange, wrappedComponentRef, getThumbnailBase64, onShowModal, onSave, onCancel, onSelectedDelete, onDelete } = this;
    const resource = { wrappedComponentRef, getThumbnailBase64, isShowModal, currentTypeForm, title, brand, onSave, onCancel, thumbnailBase64 };
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
    sortedInfo = sortedInfo || {};


    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: '10%',
        ...this.getColumnSearchProps('id'),
        sorter: (a, b) => a.id.toString().localeCompare(b.id.toString()),
        sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order
      },
      {
        title: 'Logo',
        width: '10%',
        render: (text, record) => (
          <img
            src={getImageUrl(record.thumbnail ? record.thumbnail : 'default.png', imagesGroup.logos)}
            alt=""
            style={{ width: "50px" }}
          />
        ),
      },
      {
        title: 'Thương hiệu',
        dataIndex: 'name',
        width: '30%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Quốc gia',
        dataIndex: 'country',
        width: '20%',
        ...this.getColumnSearchProps('country'),
        sorter: (a, b) => a.country.localeCompare(b.country),
        sortOrder: sortedInfo.columnKey === 'country' && sortedInfo.order,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        width: '15%',
        ...this.getColumnSearchProps('createdDate'),
        sorter: (a, b) => moment(a.createdDate).unix() - moment(b.createdDate).unix(),
        sortOrder: sortedInfo.columnKey === 'createdDate' && sortedInfo.order,
        render: (text, record) => (<span>{moment(record.createdDate).format('DD/MM/YYYY')}</span>),
      },
      {
        title: '',
        width: '15%',
        render: (text, record) => (
          <Fragment>
            <LinkButton
              type="link"
              onClick={() =>
                onShowModal(typeForm.update, `Cập nhật thông tin thương hiệu`, record)
              }
            >
              Sửa
            </LinkButton>
            <Divider type="vertical" />
            <LinkButton type="link" onClick={() => onDelete(record.id)}>
              Xoá
            </LinkButton>
          </Fragment>
        )
      },
    ];

    return (
      <Fragment>
        <ButtonsWrapper>
          <ActionButton
            type="primary"
            onClick={() =>
              onShowModal(typeForm.create, `Tạo mới thương hiệu`, null)
            }
          >
            Tạo mới
          </ActionButton>
          {selectedRowKeys.length > 0 && (
            <ActionButton
              type="danger"
              onClick={() => onSelectedDelete(selectedRowKeys)}
            >
              Xóa
            </ActionButton>
          )}
        </ButtonsWrapper>

        <Table
          rowKey='id'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={brandList}
          onChange={handleChange}
        />
        <BrandForm {...resource} />
      </Fragment>
    );
  }
}

export default BrandPage;

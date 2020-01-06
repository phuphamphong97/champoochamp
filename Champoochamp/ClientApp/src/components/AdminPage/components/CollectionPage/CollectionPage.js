import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Table, Input, Button, Icon, notification } from 'antd';

import { callAPI, getImageUrl } from '../../../../shared/utils';
import { time, typeForm, imagesGroup } from '../../../../shared/constants';

import CollectionForm from './components/CollectionForm';

class CollectionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      collectionList: [],
      isShowModal: false,
      title: '',
      collection: null,
      currentTypeForm: '',
      fileName: '',
      imageUrl: ''
    };
  }

  componentDidMount() {
    this.getAllCollections();
  }

  getAllCollections = () => {
    callAPI('Collection/GetAllCollections')
      .then(res => this.setState({ collectionList: res.data }));
  }

  getAvatarInfo = (fileName, imageUrl) => {
    this.setState({
      fileName,
      imageUrl
    });
  }

  onShowModal = (typeForm, title, collection) => {
    this.setState({
      isShowModal: true,
      currentTypeForm: typeForm,
      title,
      collection
    });
  };

  onSave = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      const { currentTypeForm, collectionList } = this.state;
      const { employee } = this.props;

      if (err) {
        return;
      }

      if (currentTypeForm === typeForm.create) {
        callAPI('Collection/CreateCollection', '', 'POST', values)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                collectionList.push(res.data);

                this.setState({
                  isShowModal: false,
                  collectionList
                });
                form.resetFields();

                notification.info({
                  message: 'Tạo mới bộ sưu tập thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Đơn vị tính đã tồn tại!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
            }
            else {
              this.setState({ isShowModal: false });
              form.resetFields();

              notification.warning({
                message: 'Tạo mới bộ sưu tập thất bại!',
                placement: 'topRight',
                onClick: () => notification.destroy(),
                duration: time.durationNotification
              });
            }
          });
      }
      else if (currentTypeForm === typeForm.update) {
        const data = {
          employee,
          collection: values,
          collectionList: []
        }
        callAPI('Collection/PutCollection', '', 'PUT', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                let lst = collectionList;
                lst = collectionList.filter(collection => collection.id !== res.data.id)
                lst.unshift(res.data);

                this.setState({
                  isShowModal: false,
                  collectionList: lst
                });
                form.resetFields();

                notification.info({
                  message: 'Cập nhật bộ sưu tập thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Đơn vị tính đã tồn tại!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
            }
            else {
              this.setState({ isShowModal: false });
              form.resetFields();

              notification.warning({
                message: 'Cập nhật bộ sưu tập thất bại!',
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
    this.setState({ isShowModal: false });
    this.formRef.props.form.resetFields();
  };

  onSelectedDelete = ids => {
    let collectionList = [];
    ids.map(id => collectionList.push({ id }));
    const data = {
      employee: null,
      collection: null,
      collectionList
    };

    callAPI('Collection/DeleteCollectionByIds', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => !ids.includes(key)),
            collectionList: this.state.collectionList.filter(collection => !ids.includes(collection.id))
          });

          notification.info({
            message: 'Xóa bộ sưu tập thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Xóa bộ sưu tập thất bại!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
      });
  };

  onDelete = id => {
    const data = { id };

    callAPI('Collection/DeleteCollectionById', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
            collectionList: this.state.collectionList.filter(collection => collection.id !== id)
          });

          notification.info({
            message: 'Xóa bộ sưu tập thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Xóa bộ sưu tập thất bại!',
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
    let { selectedRowKeys, sortedInfo, collectionList, isShowModal, currentTypeForm, title, collection } = this.state;
    const { handleChange, onSelectChange, wrappedComponentRef, getAvatarInfo, onShowModal, onSave, onCancel, onSelectedDelete, onDelete } = this;
    const resource = { wrappedComponentRef, getAvatarInfo, isShowModal, currentTypeForm, title, collection, onSave, onCancel };
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
    sortedInfo = sortedInfo || {};


    const columns = [
      {
        title: 'Ảnh bộ sưu tập',
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
        width: '20%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createDate',
        width: '50%',
        ...this.getColumnSearchProps('createDate'),
        sorter: (a, b) => moment(a.createDate).unix() - moment(b.createDate).unix(),
        sortOrder: sortedInfo.columnKey === 'createDate' && sortedInfo.order,
        render: (text, record) => (<span>{moment(record.createDate).format('DD/MM/YYYY')}</span>),
      },
      {
        title: 'Action',
        width: '10%',
        render: (text, record) => (
          <Fragment>
            <Icon type="edit" onClick={() => onShowModal(typeForm.update, `Cập nhật bộ sưu tập`, record)} />
            <Icon type="delete" onClick={() => onDelete(record.id)} />
          </Fragment>
        ),
      },
    ];

    return (
      <div>
        <Button type="primary" onClick={() => onShowModal(typeForm.create, `Tạo mới bộ sưu tập`, null)}>Tạo mới</Button>
        <Button type="primary" onClick={() => onSelectedDelete(selectedRowKeys)}>Xóa</Button>
        <Table
          rowKey='id'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={collectionList}
          onChange={handleChange}
        />
        <CollectionForm {...resource} />
      </div>
    );
  }
}

export default CollectionPage;

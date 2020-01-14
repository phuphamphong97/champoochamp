import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Table, Input, Button, Icon, Divider, notification } from 'antd';

import { callAPI, getImageUrl, formatDateTime } from '../../../../shared/util';
import { imagesGroup, time, typeForm } from '../../../../shared/constants';
import { ButtonsWrapper, ActionButton, LinkButton } from '../../styledUtils';

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
      thumbnailBase64: ''
    };
  }

  componentDidMount() {
    this.getAllCollections();
  }

  getAllCollections = () => {
    callAPI('Collection/GetAllCollections')
      .then(res => this.setState({ collectionList: res.data ? res.data : [] }));
  }

  getThumbnailBase64 = thumbnailBase64 => {
    this.setState({ thumbnailBase64 });
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
    const { currentTypeForm, collectionList, thumbnailBase64 } = this.state;
    const { employee } = this.props;
    const { form } = this.formRef.props;

    form.validateFields((err, values) => {
      const data = {
        employee,
        collection: values,
        thumbnailBase64,
        folderName: imagesGroup.collections,
        collectionList: []
      }

      if (err) {
        return;
      }

      if (currentTypeForm === typeForm.create) {
        callAPI('Collection/CreateCollection', '', 'POST', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                collectionList.push(res.data);

                this.setState({
                  isShowModal: false,
                  collectionList,
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
                  message: 'Bộ sưu tập đã tồn tại, vui lòng nhập bộ sưu tập khác!',
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
        callAPI('Collection/PutCollection', '', 'PUT', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                let lst = collectionList;
                lst = collectionList.filter(collection => collection.id !== res.data.id)
                lst.unshift(res.data);

                this.setState({
                  isShowModal: false,
                  collectionList: lst,
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
                  message: 'Bộ sưu tập đã tồn tại, vui lòng nhập bộ sưu tập khác!',
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

    callAPI('Collection/DeleteCollectionById', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
            collectionList: this.state.collectionList.filter(collection => collection.id !== id)
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
    let { selectedRowKeys, sortedInfo, collectionList, isShowModal, currentTypeForm, title, collection, thumbnailBase64 } = this.state;
    const { handleChange, onSelectChange, wrappedComponentRef, getThumbnailBase64, onShowModal, onSave, onCancel, onSelectedDelete, onDelete } = this;
    const resource = { wrappedComponentRef, getThumbnailBase64, isShowModal, currentTypeForm, title, collection, onSave, onCancel, thumbnailBase64 };
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
        title: 'Ảnh',
        width: '10%',
        render: (text, record) => (
          <img
            src={getImageUrl(record.thumbnail ? record.thumbnail : 'default.png', imagesGroup.collections)}
            alt=""
            style={{ width: "50px" }}
          />
        ),
      },
      {
        title: 'Bộ sưu tập',
        dataIndex: 'name',
        width: '20%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        width: '45%',
        ...this.getColumnSearchProps('createdDate'),
        sorter: (a, b) => moment(a.createdDate).unix() - moment(b.createdDate).unix(),
        sortOrder: sortedInfo.columnKey === 'createdDate' && sortedInfo.order,
        render: (text, record) => (
          <span>{formatDateTime(record.createdDate)}</span>
        )
      },
      {
        title: '',
        width: '15%',
        render: (text, record) => (
          <Fragment>
            <LinkButton
              type="link"
              onClick={() =>
                onShowModal(typeForm.update, `Cập nhật bộ sưu tập`, record)
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
              onShowModal(typeForm.create, `Tạo mới bộ sưu tập`, null)
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
          dataSource={collectionList}
          onChange={handleChange}
        />
        <CollectionForm {...resource} />
      </Fragment>
    );
  }
}

export default CollectionPage;

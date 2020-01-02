import React, { Component } from 'react';
import axios from "axios";
import { withRouter } from 'react-router-dom';
import { Icon, Drawer, notification } from 'antd';
import styled from '@emotion/styled';

import { callAPI, setCookie } from '../../../../shared/utils';
import { breakpoint } from '../../../../shared/principles';
import { localStorageKey, time } from '../../../../shared/constants';

import SearchBar from '../SearchBar';
import CartSummary from './components/CartSummary';
import ShoppingCartHeader from './components/ShoppingCartHeader';
import UserHeader from './components/UserHeader';
import CollapseMenu from './components/CollapseMenu';

const Wrapper = styled('div')`
  align-items: center;
  display: flex;
`;

const MenuItem = styled('div')`
  padding: 10px 15px;

  &:last-child {
    padding: 0;
  }

  &:nth-last-of-type(2) {
    padding-right: 0;
  }

  ${breakpoint.lg`
    &:last-child {
      padding: 10px 0 10px 15px;
    }

    &:nth-last-of-type(2){
      padding: 10px 15px;
    }
  `}
`;

const LargeSearchBar = styled('div')`
  ${breakpoint.lg`
    display: none;
  `}
`;

const StyledDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    max-width: 425px;
    width: 100vw !important;

    .ant-drawer-body {
      padding: 0;
    }
  }
`;

const CollapseMenuButton = styled(Icon)`
  display: none !important;

  ${breakpoint.lg`
    display: inline-block !important;
  `}
`;

class NavBarRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryMenu: [],
      collectionMenu: [],
      isMenuDrawerVisible: false,
      isCartDrawerVisible: false,
      searchData: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.isCartDrawerVisible && nextProps.isCartDrawerVisible) {
      return {
        isCartDrawerVisible: true
      };
    }

    return null;
  }

  componentDidMount() {
    axios.all([
      callAPI(`Search/GetSearchData`),
      callAPI(`Category/GetAllCategories`, `?$filter=parent eq null`),
      callAPI(`Collection/GetAllCollections`)
    ]).then(axios.spread((...res) => {
      this.setState({
        searchData: res[0].data,
        categoryMenu: res[1].data,
        collectionMenu: res[2].data
      });
    }));
  }

  onShowDrawer = drawerType => {
    this.setState({
      [drawerType]: true
    });
  };

  onCloseDrawer = drawerType => {
    this.props.onRenderCart(false);
    this.setState({
      [drawerType]: false
    });
  };

  onLogout = () => {
    setCookie(localStorageKey.emailKey, '', -1);
    setCookie(localStorageKey.passwordKey, '', -1);
    this.props.getLoginUser(null);
    notification.info({
      message: 'Đăng xuất thành công!',
      placement: 'topRight',
      onClick: () => notification.destroy(),
      duration: time.durationNotification
    });
  };

  render() {
    const {
      user,
      strShoppingCart,
      updateShoppingCart,
      getDiscount,
      history
    } = this.props;
    const {
      categoryMenu,
      collectionMenu,
      isMenuDrawerVisible,
      isCartDrawerVisible,
      searchData
    } = this.state;

    return (
      <Wrapper>
        <LargeSearchBar>
          <SearchBar suggestions={searchData} history={history} />
        </LargeSearchBar>
        <MenuItem>
          <ShoppingCartHeader
            strShoppingCart={strShoppingCart}
            onShowDrawer={() => this.onShowDrawer('isCartDrawerVisible')}
          />
        </MenuItem>
        <MenuItem>
          <UserHeader
            user={user}
            onLogout={this.onLogout}
            getDiscount={getDiscount}
          />
        </MenuItem>
        <MenuItem>
          <CollapseMenuButton
            type="menu"
            onClick={() => this.onShowDrawer('isMenuDrawerVisible')}
          />
        </MenuItem>

        <StyledDrawer
          placement="right"
          closable={false}
          onClose={() => this.onCloseDrawer('isCartDrawerVisible')}
          visible={isCartDrawerVisible}
        >
          <CartSummary
            user={user}
            strShoppingCart={strShoppingCart}
            updateShoppingCart={updateShoppingCart}
            onCloseDrawer={() => this.onCloseDrawer('isCartDrawerVisible')}
          />
        </StyledDrawer>

        <StyledDrawer
          placement="right"
          closable={false}
          onClose={() => this.onCloseDrawer('isMenuDrawerVisible')}
          visible={isMenuDrawerVisible}
        >
          <CollapseMenu
            categoryMenu={categoryMenu}
            collectionMenu={collectionMenu}
            onCloseMenu={() => this.onCloseDrawer('isMenuDrawerVisible')}
          />
        </StyledDrawer>
      </Wrapper>
    );
  }
}

export default withRouter(NavBarRight);

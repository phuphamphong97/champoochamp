import React, { Component } from 'react';
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
import { Link, MainMenu } from '../../../elements';

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

const BackButton = styled('div')`
  margin-top: 20px;
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
    callAPI(`Search/GetSearchData`).then(res =>
      this.setState({ searchData: res.data })
    );
    callAPI(`Category/GetAllCategories`, `?$filter=parent eq null`).then(res =>
      this.setState({
        categoryMenu: res.data
      })
    );
    callAPI(`Collection/GetAllCollections`).then(res =>
      this.setState({
        collectionMenu: res.data
      })
    );
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
    const { user, strShoppingCart, updateShoppingCart, getDiscount, history } = this.props;
    const { categoryMenu, collectionMenu, isMenuDrawerVisible, isCartDrawerVisible, searchData } = this.state;

    return (
      <Wrapper>
        <SearchBar suggestions={searchData} history={history} />
        <MenuItem>
          <ShoppingCartHeader
            strShoppingCart={strShoppingCart}
            onShowDrawer={() => this.onShowDrawer('isCartDrawerVisible')}
          />
        </MenuItem>
        <MenuItem>
          <UserHeader user={user} onLogout={this.onLogout} getDiscount={getDiscount} />
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
          <MainMenu mode="inline" categoryMenu={categoryMenu} collectionMenu={collectionMenu} />
          <BackButton>
            <Link
              content="Quay lại"
              iconType="fas fa-chevron-left"
              onClick={() => this.onCloseDrawer('isMenuDrawerVisible')}
            />
          </BackButton>
        </StyledDrawer>
      </Wrapper>
    );
  }
}

export default withRouter(NavBarRight);

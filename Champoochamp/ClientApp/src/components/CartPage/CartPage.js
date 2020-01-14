import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { notification } from 'antd';
import styled from '@emotion/styled';

import {
  callAPI,
  updateShoppingCart,
  getStrShoppingCart
} from '../../shared/util';
import { localStorageKey, time } from '../../shared/constants';

import { PageContainer, Section, SectionTitle, Link } from '../elements';
import CartItemList from './components/CartItemList';
import CartInfo from './components/CartInfo';

const BackButton = styled('div')`
  margin-top: 10px;
`;

class CartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInitedFrom: false,
      isShoppingCartChanged: false,
      strShoppingCart: props.strShoppingCart,
      shoppingCartList: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.strShoppingCart !== prevState.strShoppingCart) {
      return {
        strShoppingCart: nextProps.strShoppingCart,
        isShoppingCartChanged: true
      };
    }

    return null;
  }

  componentDidUpdate() {
    const { isShoppingCartChanged } = this.state;
    const { user } = this.props;
    isShoppingCartChanged && this.getShoppingCart(user);
  }

  componentDidMount() {
    this.getShoppingCart(this.props.user);
  }

  getShoppingCart = user => {
    const data = {
      email: user && user.email,
      shoppingCarts: `${localStorage.getItem(localStorageKey.storageShoppingCartKey)}`
    };

    callAPI('Cart/GetShoppingCart', '', 'POST', data).then(res => this.setState({
      isInitedFrom: true,
      isShoppingCartChanged: false,
      shoppingCartList: res.data
    }), () =>
        !user && localStorage.setItem(localStorageKey.storageShoppingCartKey, getStrShoppingCart(this.state.shoppingCartList))      
    );
  };

  onUpdateQuantity = (productVariantId, quantity) => {
    const { shoppingCartList } = this.state;
    const { user } = this.props;

    shoppingCartList.find(
      p => p.productVariant.id === productVariantId
    ).quantity = parseInt(quantity, 10);

    updateShoppingCart(
      getStrShoppingCart(shoppingCartList),
      user,
      this.props.updateShoppingCart
    );
  };

  onDeleteProduct = productVariantId => {
    const { shoppingCartList } = this.state;
    const { user, getDiscount } = this.props;
    const shoppingCartListNew = shoppingCartList.filter(
      p => p.productVariant.id !== productVariantId
    );
    
    updateShoppingCart(
      getStrShoppingCart(shoppingCartListNew),
      user,
      this.props.updateShoppingCart
    );

    if (shoppingCartListNew.length === 0) {
      getDiscount(null);
    }

    notification.info({
      message: 'Xóa sản phẩm thành công!',
      placement: 'topRight',
      onClick: () => notification.destroy(),
      duration: time.durationNotification,
    });
  };

  render() {
    const { isInitedFrom, shoppingCartList } = this.state;
    const { discount, getDiscount } = this.props;

    return (
      <PageContainer>
        <Section>
          <SectionTitle content="Giỏ hàng" />
          {
            !isInitedFrom ? null :
            shoppingCartList.length > 0 ? (
              <Fragment>
                <CartItemList shoppingCartList={shoppingCartList} onUpdateQuantity={this.onUpdateQuantity} onDeleteProduct={this.onDeleteProduct} />
                <CartInfo shoppingCartList={shoppingCartList} discount={discount} getDiscount={getDiscount} />
              </Fragment>
            ) : (
              <Fragment>
                <span>Không có sản phẩm nào trong giỏ hàng.</span>
                <NavLink to="/">
                  <BackButton>
                    <Link content="Về trang chủ" iconType="fas fa-chevron-left" />
                  </BackButton>
                </NavLink>
              </Fragment>
            )
          }
        </Section>
      </PageContainer>
    );
  }
}

export default CartPage;

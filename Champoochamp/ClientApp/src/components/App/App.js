import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import history from '../App/history';

import Header from '../Header';
import Footer from '../Footer';
import RouterConfig from '../../router/RouterConfig';

import { callAPI, setCookie, getCookie } from '../../shared/util';
import { localStorageKey, time } from '../../shared/constants';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCartDrawerVisible: false,
      isRenderMenu: true,
      user: null,
      strShoppingCart: null,
      discount: null
    };
  }

  componentDidMount() {
    this.checkLoginUserByCookie().then(
      res => !res && this.getStrShoppingCartByUser(this.state.user)
    );
  }

  checkLoginUserByCookie = () => {
    return new Promise((resolve, reject) => {
      const timeUserSession = localStorage.getItem(localStorageKey.timeUserSessionKey);
      if (timeUserSession && new Date().getTime() - timeUserSession < time.expiresDayOfSession*24*60*60*1000) {
        this.getLoginUser(JSON.parse(localStorage.getItem(localStorageKey.userKey)));
        return resolve(true);
      }
      else {
        const data = {
          email: getCookie(localStorageKey.emailKey),
          password: getCookie(localStorageKey.passwordKey)
        };
        callAPI('User/CheckLogin', '', 'POST', data).then(res => {
          if (res.data) {
            localStorage.setItem(localStorageKey.userKey, JSON.stringify(res.data));
            localStorage.setItem(localStorageKey.timeUserSessionKey, new Date().getTime());
            setCookie(localStorageKey.emailKey, data.email, 1);
            setCookie(localStorageKey.passwordKey, data.password, 1);
            this.getLoginUser(res.data);
            return resolve(true);
          } else {
            return resolve(false);
          }
        });
      }      
    });
  };

  getStrShoppingCartByUser = user => {
    const url = 'Cart/GetStrShoppingCart';
    const data = {
      email: user && user.email,
      shoppingCarts: `${localStorage.getItem(
        localStorageKey.storageShoppingCartKey
      )}`
    };

    callAPI(url, '', 'POST', data).then(res =>
      this.setState({
        strShoppingCart: res.data
      })
    );
  };

  getLoginUser = user => {
    this.setState(
      {
        user
      },
      () => this.getStrShoppingCartByUser(this.state.user)
    );
  };

  getDiscount = discount => {
    this.setState({ discount });
  };

  updateShoppingCart = strShoppingCart => {
    this.setState({ strShoppingCart });
  };

  onRenderCart = isCartDrawerVisible => {
    this.setState({ isCartDrawerVisible });
  };

  onRenderMenu = isRenderMenu => {
    if (isRenderMenu !== this.state.isRenderMenu) {
      this.setState({ isRenderMenu });
    }
  };

  render() {
    const {
      isCartDrawerVisible,
      isRenderMenu,
      user,
      strShoppingCart,
      discount
    } = this.state;

    return (
      <Router history={history}>
        {isRenderMenu && (
          <Header
            user={user}
            getLoginUser={this.getLoginUser}
            strShoppingCart={strShoppingCart}
            updateShoppingCart={this.updateShoppingCart}
            onRenderCart={this.onRenderCart}
            isCartDrawerVisible={isCartDrawerVisible}
            getDiscount={this.getDiscount}
          />
        )}
        <RouterConfig
          user={user}
          getLoginUser={this.getLoginUser}
          strShoppingCart={strShoppingCart}
          updateShoppingCart={this.updateShoppingCart}
          onRenderMenu={this.onRenderMenu}
          onRenderCart={this.onRenderCart}
          discount={discount}
          getDiscount={this.getDiscount}
        />
        {isRenderMenu && <Footer />}
      </Router>
    );
  }
}

export default App;

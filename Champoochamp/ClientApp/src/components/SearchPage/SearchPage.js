﻿import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { callAPI } from '../../shared/utils';
import { imagesGroup } from '../../shared/constants';
import { ProductCard, PageContainer, Section } from '../elements';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: props.match.params.key,
      isSearchKeyChanged: false,
      isLoadMore: true,
      pageSize: 8,
      page: 1,
      totalProducts: 0,
      productList: [],
      showingProductList: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.key !== prevState.searchKey) {
      return {
        searchKey: nextProps.match.params.key,
        isSearchKeyChanged: true
      };
    }

    return null;
  }

  componentDidUpdate() {
    const { searchKey, isSearchKeyChanged } = this.state;

    if (isSearchKeyChanged) {
      this.getProductList(searchKey);
    }
  }

  componentDidMount() {
    this.getProductList(this.state.searchKey);

    this.scrollListener = window.addEventListener('scroll', e => {
      this.handleScroll(e);
    });
  }

  getProductList = searchKey => {
    callAPI(`Search/GetProductsBySearchKey-${searchKey}`).then(res =>
      this.setState(
        {
          isSearchKeyChanged: false,
          isLoadMore: true,
          page: 1,
          totalProducts: res.data.length,
          productList: res.data
        },
        () => this.getProducts([])
      )
    );
  };

  handleScroll = e => {
    const { isLoadMore, totalProducts, page, pageSize } = this.state;

    if (!isLoadMore) return;
    if (totalProducts <= page * pageSize) return;

    const lastCol = document.querySelector('.ant-col:last-child');
    if (lastCol) {
      const lastColOffset = lastCol.offsetTop + lastCol.clientHeight;
      const pageOffset = window.pageYOffset + window.innerHeight;
      const bottomOffset = 150;
      if (pageOffset > lastColOffset - bottomOffset) {
        this.loadMore();
      }
    }
  };

  getProducts = showingProductList => {
    const { productList, totalProducts, page, pageSize } = this.state;
    let index = (page - 1) * pageSize;

    if (totalProducts < index + pageSize) {
      this.setState({
        showingProductList: [...showingProductList, ...productList.slice(index)]
      });
    } else if (totalProducts >= index + pageSize) {
      this.setState({
        isLoadMore: true,
        showingProductList: [
          ...showingProductList,
          ...productList.slice(index, index + pageSize)
        ]
      });
    }

    return true;
  };

  loadMore = () => {
    const { showingProductList, page } = this.state;

    this.setState(
      {
        isLoadMore: false,
        page: page + 1
      },
      () => this.getProducts(showingProductList)
    );
  };

  renderProductCard = showingProductList =>
    showingProductList.map(product => {
      return (
        <Col xs={12} sm={8} md={6} xl={4} key={product.id}>
          <ProductCard imageGroup={imagesGroup.products} product={product} />
        </Col>
      );
    });

  render() {
    const { totalProducts, showingProductList } = this.state;

    return (
      <PageContainer>
        <Section>
          {totalProducts ? 
            <div>
              <h3>{totalProducts} sản phẩm</h3>
              <Row>{this.renderProductCard(showingProductList)}</Row>
            </div>            
            :
            <h3>Không tìm thấy sản phẩm</h3>
          }
        </Section>
      </PageContainer>
    );
  }
}

export default SearchPage;

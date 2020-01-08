import React, { Component } from 'react';

import getIdInMetaTitle from '../../shared/util/getIdInMetaTitle';

import { PageContainer, Section } from '../elements';
import Breadcrumb from './components/Breadcrumb';
import ProductList from './components/ProductList';

class CategoryPage extends Component {
  getCategoryId = () => {
    const { lv1, lv2 } = this.props.match.params;
    if (lv2) {
      return getIdInMetaTitle(lv2);
    }
    else if (lv1) {
      return getIdInMetaTitle(lv1);
    }

    return true;
  };

  render() {
    return (
      <PageContainer>
        <Section>
          <Breadcrumb categoryId={this.getCategoryId()}></Breadcrumb>
        </Section>
        <Section>
          <ProductList categoryId={this.getCategoryId()}></ProductList>
        </Section>
      </PageContainer>
    );
  }
}

export default CategoryPage;

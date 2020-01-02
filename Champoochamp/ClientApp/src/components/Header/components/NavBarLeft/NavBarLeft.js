import React, { Component } from 'react';
import axios from "axios";
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';

import { callAPI } from '../../../../shared/utils';
import { breakpoint } from '../../../../shared/principles';
import logo from '../../../../assets/logo.png';

import { Image, MainMenu } from '../../../elements';

const Logo = styled('div')`
  display: inline-block;
  margin-right: 30px;
  vertical-align: middle;
  width: 130px;

  ${breakpoint.sm`
    width: 110px;
  `}
`;

class NavBarLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryMenu: [],
      collectionMenu: []
    };
  }

  componentDidMount() {
    axios.all([
      callAPI(`Category/GetAllCategories`, `?$filter=parent eq null`),
      callAPI(`Collection/GetAllCollections`)
    ]).then(axios.spread((...res) => {
      this.setState({
        categoryMenu: res[0].data,
        collectionMenu: res[1].data
      });
    }));
  }

  render() {
    const { categoryMenu, collectionMenu } = this.state;

    return (
      <div>
        <Logo>
          <NavLink to="/">
            <Image imageUrl={logo} alt="logo" />
          </NavLink>
        </Logo>
        <MainMenu mode="horizontal" categoryMenu={categoryMenu} collectionMenu={collectionMenu} />
      </div>
    );
  }
}

export default NavBarLeft;

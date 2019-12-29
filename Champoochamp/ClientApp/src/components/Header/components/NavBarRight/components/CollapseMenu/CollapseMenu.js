import React, { Component } from 'react';
import styled from '@emotion/styled';

import { breakpoint } from '../../../../../../shared/principles';
import { Link, MainMenu } from '../../../../../elements';
import SearchBar from '../../../SearchBar';

const Wrapper = styled('div')`
  padding: 40px;

  ${breakpoint.sm`
    padding: 40px 20px;
  `}
`;

const SmallSearchBar = styled('div')`
  margin-bottom: 20px;
`;

const BackButton = styled('div')`
  margin-top: 30px;
`;

class CollapseMenu extends Component {
  render() {
    const { categoryMenu, collectionMenu, onCloseMenu } = this.props;

    return (
      <Wrapper>
        <SmallSearchBar>
          <SearchBar />
        </SmallSearchBar>
        <MainMenu
          mode="inline"
          categoryMenu={categoryMenu}
          collectionMenu={collectionMenu}
        />
        <BackButton>
          <Link
            content="Quay lại"
            iconType="fas fa-chevron-left"
            onClick={onCloseMenu}
          />
        </BackButton>
      </Wrapper>
    );
  }
}

export default CollapseMenu;

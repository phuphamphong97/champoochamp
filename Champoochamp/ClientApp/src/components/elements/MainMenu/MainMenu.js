import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import { typography, breakpoint } from '../../../shared/principles';
import { menuStyle, menuItemStyle } from '../../../shared/utils';

const StyledMenu = styled(Menu)`
  ${props => menuStyle(props.mode)};
`;

const StyledMenuItem = styled(Menu.Item)`
  ${menuItemStyle};
`;

const MenuItemTitle = styled('span')`
  ${typography.boldText};
  letter-spacing: 1px;

  ${breakpoint.lg`
    font-weight: normal !important;
  `}
`;

class MainMenu extends Component {
  renderCategoryMenu = (categories, url, onCloseMenu) =>
    categories.map(category => {
      if (!category.parentId) {
        return (
          <Menu.SubMenu
            key={category.id}
            title={<MenuItemTitle>{category.name}</MenuItemTitle>}
          >
            {this.renderCategoryMenu(
              category.inverseParent,
              `${url}/${category.metaTitle}`,
              onCloseMenu
            )}
          </Menu.SubMenu>
        );
      } else if (category.inverseParent.length > 0) {
        return (
          <Menu.ItemGroup key={category.id} title={category.name}>
            {this.renderCategoryMenu(
              category.inverseParent,
              `${url}/${category.metaTitle}`,
              onCloseMenu
            )}
          </Menu.ItemGroup>
        );
      } else if (category.inverseParent.length === 0) {
        return (
          <StyledMenuItem key={category.id}>
            <NavLink to={`${url}/${category.metaTitle}-${category.id}`} onClick={onCloseMenu}>
              {category.name}
            </NavLink>
          </StyledMenuItem>
        );
      }

      return true;
    });

  renderCollectionMenu = (collectionMenu, onCloseMenu) =>
    collectionMenu.map(collection => {
      return (
        <StyledMenuItem key={collection.id}>
          <NavLink to={`/bo-suu-tap/${collection.metaTitle}-${collection.id}`} onClick={onCloseMenu}>
            {collection.name}
          </NavLink>
        </StyledMenuItem>
      );
    });

  render() {
    const { mode, categoryMenu, collectionMenu, onCloseMenu } = this.props;

    return (
      <StyledMenu mode={mode}>
        {this.renderCategoryMenu(categoryMenu, '/san-pham', onCloseMenu)}
        <Menu.SubMenu title={<MenuItemTitle>Bộ sưu tập</MenuItemTitle>}>
          {this.renderCollectionMenu(collectionMenu, onCloseMenu)}
        </Menu.SubMenu>
      </StyledMenu>
    );
  }
}

MainMenu.propsTypes = {
  mode: PropTypes.string.isRequired,
  categoryMenu: PropTypes.array,
  collectionMenu: PropTypes.array,
  onCloseMenu: PropTypes.function
};

export default MainMenu;

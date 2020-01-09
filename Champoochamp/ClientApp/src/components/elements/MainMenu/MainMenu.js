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
  handleClick = () => {
    const { onCloseMenu } = this.props;
    onCloseMenu && onCloseMenu();
  }

  renderCategoryMenu = (categories, url) =>
    categories.map(category => {
      if (!category.parentId) {
        return (
          <Menu.SubMenu
            key={category.id}
            title={<MenuItemTitle>{category.name}</MenuItemTitle>}
          >
            {this.renderCategoryMenu(
              category.inverseParent,
              `${url}/${category.metaTitle}`
            )}
          </Menu.SubMenu>
        );
      }
      else if (category.inverseParent.length > 0) {
        return (
          <Menu.ItemGroup key={category.id} title={category.name}>
            {this.renderCategoryMenu(
              category.inverseParent,
              `${url}/${category.metaTitle}`
            )}
          </Menu.ItemGroup>
        );
      }
      else if (category.inverseParent.length === 0) {
        return (
          <StyledMenuItem key={category.id}>
            <NavLink to={`${url}/${category.metaTitle}-${category.id}`} onClick={this.handleClick}>
              {category.name}
            </NavLink>
          </StyledMenuItem>
        );
      }

      return true;
    });

  renderCollectionMenu = collectionMenu =>
    collectionMenu.map(collection => {
      return (
        <StyledMenuItem key={collection.id}>
          <NavLink to={`/bo-suu-tap/${collection.metaTitle}-${collection.id}`} onClick={this.handleClick}>
            {collection.name}
          </NavLink>
        </StyledMenuItem>
      );
    });

  render() {
    const { mode, categoryMenu, collectionMenu } = this.props;

    return (
      <StyledMenu mode={mode}>
        {this.renderCategoryMenu(categoryMenu, '/san-pham')}
        <Menu.SubMenu title={<MenuItemTitle>Bộ sưu tập</MenuItemTitle>}>
          {this.renderCollectionMenu(collectionMenu)}
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

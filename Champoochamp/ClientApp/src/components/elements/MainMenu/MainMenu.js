/** @jsx jsx */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import { breakpoint, colors, typography } from '../../../shared/principles';

const menuStyle = (mode)=> css`
  border: none;
  display: inline-block;
  vertical-align: middle;

  .ant-menu-submenu {
    border-bottom: 3px solid transparent;

    &:active,
    &:focus,
    &:hover {
      border-bottom: 3px solid ${colors.black};
      outline: none;
    }

    .ant-menu-submenu-title {
      padding: 0 15px;
    }
  }

  ${breakpoint.lg`
    display: ${mode === `horizontal` && `none`};
  `}
`;

const MenuItemTitle = styled('span')`
  ${typography.boldText};
  letter-spacing: 1px;
`;

const menuItemGroupStyle = css`
  .ant-menu-item {
    background: none !important;

    &:hover {
      background: ${colors.lightGray} !important;
      border: none;
      outline: none;
    }

    a {
      color: ${colors.darkGray};

      &:hover {
        color: ${colors.black};
      }
    }
  }
`;

class MainMenu extends Component {
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
      } else if (category.inverseParent.length > 0) {
        return (
          <Menu.ItemGroup
            key={category.id}
            title={category.name}
            css={menuItemGroupStyle}
          >
            {this.renderCategoryMenu(
              category.inverseParent,
              `${url}/${category.metaTitle}`
            )}
          </Menu.ItemGroup>
        );
      } else if (category.inverseParent.length === 0) {
        return (
          <Menu.Item key={category.id}>
            <NavLink to={`${url}/${category.metaTitle}-${category.id}`}>
              {category.name}
            </NavLink>
          </Menu.Item>
        );
      }

      return true;
    });

  renderCollectionMenu = collectionMenu =>
    collectionMenu.map(collection => {
      return (
        <Menu.Item key={collection.id}>
          <NavLink to={`/bo-suu-tap/${collection.metaTitle}-${collection.id}`}>
            {collection.name}
          </NavLink>
        </Menu.Item>
      );
    });

  render() {
    const { mode, categoryMenu, collectionMenu } = this.props;

    return (
      <Menu mode={mode} css={()=>menuStyle(mode)}>
        {this.renderCategoryMenu(categoryMenu, '/san-pham')}
        <Menu.SubMenu title={<MenuItemTitle>Bộ sưu tập</MenuItemTitle>}>
          {this.renderCollectionMenu(collectionMenu)}
        </Menu.SubMenu>
      </Menu>
    );
  }
}

MainMenu.propsTypes = {
  mode: PropTypes.string.isRequired,
  categoryMenu: PropTypes.array,
  collectionMenu: PropTypes.array
};

export default MainMenu;

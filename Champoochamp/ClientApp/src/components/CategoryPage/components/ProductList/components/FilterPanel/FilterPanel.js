/** @jsx jsx */
import { Component, Fragment } from 'react';
import { Row, Col, Collapse, Spin } from 'antd';
import styled from '@emotion/styled';
import { jsx, css } from '@emotion/core';

import { filtersGroup } from '../../../../../../shared/constants';
import {
  breakpoint,
  colors,
  typography
} from '../../../../../../shared/principles';
import { callAPI, getMoneyFilterGroup } from '../../../../../../shared/utils';

import { Link } from '../../../../../elements';
import SingleFilter from './conponents/SingleFilter';
import SelectedFilter from './conponents/SelectedFilter';

const { Panel } = Collapse;

const DesktopWrapper = styled('div')`
  ${breakpoint.lg`
    display: none;
  `}
`;

const MobileWrapper = styled('div')`
  display: none;
  margin-bottom: 30px;

  ${breakpoint.lg`
    display: block;
  `}
`;

const FilterWrapper = styled('div')`
  padding-right: 20px;
  margin-bottom: 20px;

  ${breakpoint.lg`
    padding: 0 10px;
  `}

  ${breakpoint.sm`
    padding: 0 5px;
  `}
`;

const FilterHeader = styled('div')`
  border-bottom: 1px solid ${colors.lightGray};
  position: relative;
`;

const FilterTitle = styled('h3')`
  ${typography.smTitle};
`;

const filterGroupWrapper = css`
  padding: 20px 0;

  ${breakpoint.lg`
    padding: 15px 0;
  `}
`;

const FilterGroupTitle = styled('span')`
  ${typography.xsTitle};
`;

const SelectedItemsWrapper = styled('div')`
  padding: 15px 0;
`;

const collapseFilterPanel = css`
  ${breakpoint.lg`
    > .ant-collapse-item {
      border-bottom: none;
    }
  `}

  .ant-collapse-header {
    padding: 0 !important;
  }

  .ant-collapse-content-box {
    margin-top: 15px;
    padding: 0 !important;
  }

  .ant-collapse-arrow {
    right: 5px !important;

    svg {
      font-size: 12px;
    }
  }
`;

class FilterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryId: this.props.categoryId,
      isCategoryChanged: false,
      isLoading: true,
      filterGroupList: [],
      moneyFilterGroup: getMoneyFilterGroup(),
      currentFilterList: [
        { name: filtersGroup.size, data: [] },
        { name: filtersGroup.color, data: [] },
        { name: filtersGroup.brand, data: [] }
      ],
      currentMoneyFilter: { id: 0 }
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.categoryId !== prevState.categoryId) {
      return {
        categoryId: nextProps.categoryId,
        isCategoryChanged: true
      };
    }

    return null;
  }

  componentDidUpdate() {
    const { isCategoryChanged, categoryId } = this.state;

    if (isCategoryChanged) {
      this.getFilterGroupList(categoryId);
    }
  }

  componentDidMount() {
    this.getFilterGroupList(this.state.categoryId);
  }

  getFilterGroupList = categoryId => {
    const url = `Filter/GetFilterGroupListByCategoryId-${categoryId}`;

    callAPI(url).then(res =>
      this.setState({
        isLoading: false,
        isCategoryChanged: false,
        filterGroupList: res.data,
        currentFilterList: [
          { name: filtersGroup.size, data: [] },
          { name: filtersGroup.color, data: [] },
          { name: filtersGroup.brand, data: [] }
        ],
        currentMoneyFilter: { id: 0 }
      })
    );
  };

  renderFilterGroupList = filterGroupList =>
    filterGroupList.map((filterGroup, index) => {
      return (
        <Panel
          key={index}
          css={filterGroupWrapper}
          header={<FilterGroupTitle>{filterGroup.name}</FilterGroupTitle>}
        >
          <Row gutter={8}>
            {filterGroup.name === filtersGroup.money
              ? this.renderMoneyFilterGroup(this.state.moneyFilterGroup)
              : this.renderFilterGroup(filterGroup)}
          </Row>
        </Panel>
      );
    });

  renderFilterGroup = filterGroup =>
    filterGroup.data.map(item => {
      return (
        <Col span={12} key={item.id}>
          <SingleFilter
            group={filterGroup.name}
            filterItem={item}
            title={item.name}
            callback={this.parentOnclick}
          />
        </Col>
      );
    });

  renderMoneyFilterGroup = moneyFilterGroup =>
    moneyFilterGroup.data.map(item => {
      if (!item.fromMoney) {
        return (
          <Col xs={12} lg={24} key={item.id}>
            <SingleFilter
              group={moneyFilterGroup.name}
              filterItem={item}
              title={`Dưới ${item.toMoney}`}
              callback={this.parentOnclick}
            />
          </Col>
        );
      } else if (!item.toMoney) {
        return (
          <Col xs={12} lg={24} key={item.id}>
            <SingleFilter
              group={moneyFilterGroup.name}
              filterItem={item}
              title={`Trên ${item.fromMoney}`}
              callback={this.parentOnclick}
            />
          </Col>
        );
      } else {
        return (
          <Col xs={12} lg={24} key={item.id}>
            <SingleFilter
              group={moneyFilterGroup.name}
              filterItem={item}
              title={`${item.fromMoney} - ${item.toMoney}`}
              callback={this.parentOnclick}
            />
          </Col>
        );
      }
    });

  renderCurrentFilterList = currentFilterList =>
    currentFilterList.map(currentFilter => {
      return currentFilter.data.map(item => {
        return (
          <SelectedFilter
            key={item.id}
            group={currentFilter.name}
            filterItem={item}
            title={item.name}
            iconType="fas fa-times"
            callback={this.parentOnclick}
          />
        );
      });
    });

  renderCurrentMoneyFilter = (group, currentMoneyFilter) => {
    if (currentMoneyFilter.id === 0) {
      return true;
    } else if (!currentMoneyFilter.fromMoney) {
      return (
        <SelectedFilter
          key={currentMoneyFilter.id}
          group={group}
          filterItem={currentMoneyFilter}
          title={`Dưới ${currentMoneyFilter.toMoney}`}
          iconType="fas fa-times"
          callback={this.parentOnclick}
        />
      );
    } else if (!currentMoneyFilter.toMoney) {
      return (
        <SelectedFilter
          key={currentMoneyFilter.id}
          group={group}
          filterItem={currentMoneyFilter}
          title={`Trên ${currentMoneyFilter.fromMoney}`}
          iconType="fas fa-times"
          callback={this.parentOnclick}
        />
      );
    } else {
      return (
        <SelectedFilter
          key={currentMoneyFilter.id}
          group={group}
          filterItem={currentMoneyFilter}
          title={`${currentMoneyFilter.fromMoney} - ${currentMoneyFilter.toMoney}`}
          iconType="fas fa-times"
          callback={this.parentOnclick}
        />
      );
    }
  };

  clearCurrentFilterList = () => {
    const { currentFilterList } = this.state;

    currentFilterList.forEach(groupFilter => {
      groupFilter.data = [];
    });

    this.setState(
      {
        currentFilterList,
        currentMoneyFilter: { id: 0 }
      },
      () =>
        this.props.getCurrentFilterList(
          this.state.currentFilterList,
          this.state.currentMoneyFilter
        )
    );
  };

  parentOnclick = (group, filterItem) => {
    const { currentFilterList, currentMoneyFilter } = this.state;

    if (group === filtersGroup.money) {
      if (currentMoneyFilter.id === filterItem.id) {
        this.setState({ currentMoneyFilter: { id: 0 } }, () =>
          this.props.getCurrentFilterList(
            this.state.currentFilterList,
            this.state.currentMoneyFilter
          )
        );
      } else {
        this.setState({ currentMoneyFilter: filterItem }, () =>
          this.props.getCurrentFilterList(
            this.state.currentFilterList,
            this.state.currentMoneyFilter
          )
        );
      }
    } else {
      let isDelete = false;

      currentFilterList.forEach(groupFilter => {
        if (groupFilter.name === group) {
          groupFilter.data.forEach((item, index, object) => {
            if (item.id === filterItem.id) {
              object.splice(index, 1);
              isDelete = true;
            }
          });

          if (!isDelete) {
            groupFilter.data.push(filterItem);
          }
        }
      });

      this.setState({ currentFilterList }, () =>
        this.props.getCurrentFilterList(
          this.state.currentFilterList,
          this.state.currentMoneyFilter
        )
      );
    }
  };

  render() {
    const {
      isLoading,
      filterGroupList,
      currentFilterList,
      currentMoneyFilter
    } = this.state;

    return isLoading ? (
      <Spin />
    ) : (
      <Fragment>
        <MobileWrapper>
          <Collapse bordered={false} css={collapseFilterPanel}>
            <Panel
              header={
                <Link content="Bộ lọc" iconType="fas fa-sliders-h"></Link>
              }
              showArrow={false}
            >
              <FilterWrapper>
                <FilterHeader>
                  <FilterTitle>Lọc sản phẩm</FilterTitle>
                  <Link content="Xoá tất cả" iconType="fas fa-times"></Link>
                  <SelectedItemsWrapper>
                    {this.renderCurrentFilterList(currentFilterList)}
                    {this.renderCurrentMoneyFilter(
                      filtersGroup.money,
                      currentMoneyFilter
                    )}
                  </SelectedItemsWrapper>
                </FilterHeader>

                <Collapse bordered={false} expandIconPosition="right">
                  {this.renderFilterGroupList(filterGroupList)}
                </Collapse>
              </FilterWrapper>
            </Panel>
          </Collapse>
        </MobileWrapper>

        <DesktopWrapper>
          <FilterWrapper>
            <FilterHeader>
              <FilterTitle>Lọc sản phẩm</FilterTitle>
              <Link content="Xoá tất cả" iconType="fas fa-times"></Link>
              <SelectedItemsWrapper>
                {this.renderCurrentFilterList(currentFilterList)}
                {this.renderCurrentMoneyFilter(
                  filtersGroup.money,
                  currentMoneyFilter
                )}
              </SelectedItemsWrapper>
            </FilterHeader>

            <Collapse
              bordered={false}
              expandIconPosition="right"
              css={collapseFilterPanel}
            >
              {this.renderFilterGroupList(filterGroupList)}
            </Collapse>
          </FilterWrapper>
        </DesktopWrapper>
      </Fragment>
    );
  }
}

export default FilterPanel;

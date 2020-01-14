import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Slider from 'react-slick';
import styled from '@emotion/styled';

import { breakpoint, colors } from '../../../../shared/principles';
import { callAPI, getImageUrl } from '../../../../shared/util';
import { imagesGroup } from '../../../../shared/constants';

const Wrapper = styled('div')`
  overflow-x: hidden;

  .slick-dots {
    bottom: 20px;

    li button:before {
      color: ${colors.white};
      font-size: 8px;
    }

    li.slick-active button:before {
      color: ${colors.white};
    }
  }
`;

const SingleSlide = styled('div')`
  background: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  height: 90vh;
  margin-top: 80px;

  ${breakpoint.sm`
   margin-top: 60px;
  `}
`;

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideList: []
    };
  }

  componentDidMount() {
    this.getAllSlides();
  }

  getAllSlides = () => {
    callAPI('Slide/GetAllSlides')
      .then(res => this.setState({ slideList: res.data }));
  }


  renderSlide = slideList => slideList.map(slide => {
    return (
      <NavLink key={slide.id} to={slide.link} onClick={this.handleOnClick}>
        <SingleSlide imageUrl={getImageUrl(slide.thumbnail, imagesGroup.banners)} />
      </NavLink>
    );
  })

  render() {
    const { slideList } = this.state;

    return (
      <Wrapper>
        <Slider
          dots={true}
          infinite
          autoplay
          autoplaySpeed={10000}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
        >
          { this.renderSlide(slideList) }
        </Slider>
      </Wrapper>
    );
  }
}

export default Banner;

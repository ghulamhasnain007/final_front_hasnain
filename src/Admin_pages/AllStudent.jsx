import React from 'react';
import Navi from '../Admin_comp/Navi';
import { Layout, theme, Carousel } from 'antd'; // Import Carousel from Ant Design
import Student_data from '../Admin_comp/Student_data';

const { Header, Content, Footer } = Layout;

function Allstudent() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div>
      <Navi />
      <Content style={{ padding: '0 48px' }}>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* Use Carousel for responsive slider */}
          <Carousel dots responsive={[
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                },
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                },
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                },
              },
            ]}
          >
            
          </Carousel>
          <Student_data />
        </div>
      </Content>
    </div>
  );
}

export default Allstudent;

import React from 'react'
import Navi from '../Admin_comp/Navi'
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import CardGrid from '../Admin_comp/Card_comp';
const { Header, Content, Footer } = Layout;
import Chart from '../Admin_comp/Chart'
function Dashboard() {
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
  return (
    <div>
      <br /><br /><br /><br />
      <Navi/>
       <Content
        style={{
          padding: '0 48px',
        }}
      >
       
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          

          <CardGrid/> <br />  <br /> 
          <Chart/>
        </div>
      </Content>
    </div>
  )
}

export default Dashboard

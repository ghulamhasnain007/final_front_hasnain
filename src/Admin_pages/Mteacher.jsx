import React from 'react'
import Navi from '../Admin_comp/Navi'
import { Layout, theme } from 'antd';
import AddTeacher from '../Admin_comp/Addteacher';
const { Header, Content, Footer } = Layout;
function Mteacher() {
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
  return (
    <div>
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
          <AddTeacher  />
        </div>
      </Content>
    </div>
  )
}

export default Mteacher

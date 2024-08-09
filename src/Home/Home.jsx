import { Layout } from 'antd';
import Header from './PortalHome/Header'
import ContentComponent from './PortalHome/ContentComponent'
import Foter from './Footer'
const { Content } = Layout;

export default function Home() {
  return (
    <>
    
    <Layout>     
      <Header/>    
      <Content>
        <ContentComponent/>
      </Content> <br /><br />
      <Foter/>
    </Layout>
    </>
    
     
  )
}

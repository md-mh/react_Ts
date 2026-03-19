import React from "react";
import { Layout, Typography } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

const { Header, Content } = Layout;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 0 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff !important;
  text-decoration: none !important;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;

  .anticon {
    font-size: 24px;
    color: #4fc3f7;
  }
`;

const StyledContent = styled(Content)`
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
`;

const AppLayout: React.FC = () => {
  return (
    <Layout>
      <StyledHeader>
        <Logo to="/">
          <ShoppingOutlined />
          <Typography.Text
            style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}
          >
            Product Store
          </Typography.Text>
        </Logo>
      </StyledHeader>
      <StyledContent>
        <Outlet />
      </StyledContent>
    </Layout>
  );
};

export default AppLayout;

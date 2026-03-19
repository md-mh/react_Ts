import React from "react";
import { Card, Skeleton, Row, Col } from "antd";
import styled from "styled-components";

const SkeletonCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  .ant-card-body {
    padding: 16px;
  }
`;

export const TableSkeleton: React.FC = () => (
  <div style={{ padding: 24 }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <Skeleton
        key={i}
        active
        title={false}
        paragraph={{ rows: 1, width: "100%" }}
        style={{ marginBottom: 16 }}
      />
    ))}
  </div>
);

export const ProductDetailSkeleton: React.FC = () => (
  <div className="page-container">
    <Row gutter={[32, 32]}>
      <Col xs={24} md={10}>
        <SkeletonCard>
          <Skeleton.Image active style={{ width: "100%", height: 350 }} />
        </SkeletonCard>
      </Col>
      <Col xs={24} md={14}>
        <Skeleton active paragraph={{ rows: 1 }} />
        <Skeleton active title={false} paragraph={{ rows: 4 }} />
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={8}>
            <Skeleton.Button active block />
          </Col>
          <Col span={8}>
            <Skeleton.Button active block />
          </Col>
          <Col span={8}>
            <Skeleton.Button active block />
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
);

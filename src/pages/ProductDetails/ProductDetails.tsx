import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Tag,
  Rate,
  Button,
  Image,
  Card,
  Statistic,
  Divider,
  Alert,
  Breadcrumb,
  Space,
  Badge,
  List,
  Avatar,
} from "antd";
import {
  EditOutlined,
  ArrowLeftOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { useGetProductByIdQuery } from "../../redux/api/productsApi";
import { ProductDetailSkeleton } from "../../components/ProductSkeleton/ProductSkeleton";
import EditProductDrawer from "../../components/EditProductDrawer/EditProductDrawer";
import "../../styles/global.scss";

const { Title, Text, Paragraph } = Typography;

const ImageCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  .ant-card-body {
    padding: 12px;
  }
`;

const InfoCard = styled(Card)`
  border-radius: 12px;
  height: 100%;
  .ant-card-body {
    padding: 24px;
  }
`;

const PriceTag = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 16px 0;

  .current-price {
    font-size: 32px;
    font-weight: 700;
    color: #16a34a;
  }

  .original-price {
    font-size: 18px;
    text-decoration: line-through;
    color: #9ca3af;
  }
`;

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const productId = Number(id);
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId, { skip: !id || isNaN(productId) });

  if (isLoading) return <ProductDetailSkeleton />;

  if (error || !product) {
    return (
      <div className="page-container error-container">
        <Alert
          message="Product Not Found"
          description="The product you're looking for doesn't exist or failed to load."
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate("/")}>
              Back to Products
            </Button>
          }
        />
      </div>
    );
  }

  const discountedPrice = product.price;
  const originalPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;

  return (
    <div className="page-container">
      <div className="mb-6">
        <Breadcrumb
          items={[
            {
              title: (
                <span onClick={() => navigate("/")} className="cursor-pointer">
                  Products
                </span>
              ),
            },
            { title: product.title },
          ]}
        />
      </div>

      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/")}
        className="mb-4"
      >
        Back to Products
      </Button>

      <Row gutter={[32, 32]}>
        {/* Product Images */}
        <Col xs={24} lg={10}>
          <ImageCard>
            <Image.PreviewGroup>
              <Image
                src={product.images[0] ?? product.thumbnail}
                alt={product.title}
                style={{
                  width: "100%",
                  maxHeight: 400,
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <Image
                      key={i}
                      src={img}
                      alt={`${product.title} ${i + 1}`}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                  ))}
                </div>
              )}
            </Image.PreviewGroup>
          </ImageCard>
        </Col>

        {/* Product Info */}
        <Col xs={24} lg={14}>
          <InfoCard>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <div className="flex items-start justify-between">
                <div>
                  <Tag color="blue" className="capitalize">
                    {product.category}
                  </Tag>
                  {product.brand && (
                    <Tag color="gold-inverse" className="ml-2">
                      {product.brand}
                    </Tag>
                  )}
                  <Badge
                    status={product.stock > 0 ? "success" : "error"}
                    text={product.availabilityStatus}
                    className="ml-2"
                  />
                </div>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setDrawerOpen(true)}
                >
                  Edit
                </Button>
              </div>

              <Title level={2} className="mt-2 mb-0">
                {product.title}
              </Title>

              <div className="flex items-center gap-2">
                <Rate disabled value={product.rating} allowHalf />
                <Text type="secondary">
                  ({product.rating}) · {product.reviews?.length ?? 0} reviews
                </Text>
              </div>

              <PriceTag>
                <span className="current-price">
                  ${discountedPrice.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="original-price">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <Tag color="red">
                    -{product.discountPercentage.toFixed(0)}%
                  </Tag>
                )}
              </PriceTag>

              <Paragraph type="secondary" style={{ fontSize: 15 }}>
                {product.description}
              </Paragraph>

              <Divider />

              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Price"
                    value={product.price}
                    prefix={<DollarOutlined />}
                    precision={2}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Stock"
                    value={product.stock}
                    prefix={<ShoppingCartOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Rating"
                    value={product.rating}
                    prefix={<StarOutlined />}
                    precision={2}
                  />
                </Col>
              </Row>

              <Divider />

              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <Text type="secondary">SKU:</Text>{" "}
                  <Text strong>{product.sku}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Weight:</Text>{" "}
                  <Text strong>{product.weight}g</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Warranty:</Text>{" "}
                  <Text strong>{product.warrantyInformation}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Shipping:</Text>{" "}
                  <Text strong>{product.shippingInformation}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Return Policy:</Text>{" "}
                  <Text strong>{product.returnPolicy}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Min. Order:</Text>{" "}
                  <Text strong>{product.minimumOrderQuantity}</Text>
                </Col>
              </Row>
            </Space>
          </InfoCard>
        </Col>
      </Row>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <Card
          title="Customer Reviews"
          className="mt-8"
          style={{ borderRadius: 12 }}
        >
          <List
            itemLayout="horizontal"
            dataSource={product.reviews}
            renderItem={(review) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <div className="flex items-center gap-2">
                      <span>{review.reviewerName}</span>
                      <Rate
                        disabled
                        value={review.rating}
                        style={{ fontSize: 12 }}
                      />
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph className="mb-1">{review.comment}</Paragraph>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(review.date).toLocaleDateString()}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      <EditProductDrawer
        open={drawerOpen}
        product={product}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default ProductDetails;

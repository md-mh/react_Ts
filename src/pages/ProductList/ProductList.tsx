import React, { useState, useMemo, useCallback } from "react";
import { Table, Input, Select, Tag, Rate, Button, Alert } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
} from "../../redux/api/productsApi";
import type { Product } from "../../types/product";
import { TableSkeleton } from "../../components/ProductSkeleton/ProductSkeleton";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[1]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );

  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedSearch(value);
        setCurrentPage(1);
        setSelectedCategory(undefined);
      }, 400);
    },
    [],
  );

  const handleCategoryChange = useCallback((value: string | undefined) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    if (value) {
      setSearchQuery("");
      setDebouncedSearch("");
    }
  }, []);

  const handlePageSizeChange = useCallback((value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  }, []);

  const queryParams = useMemo(
    () => ({
      limit: pageSize,
      skip: (currentPage - 1) * pageSize,
      q: debouncedSearch || undefined,
      category: !debouncedSearch ? selectedCategory : undefined,
    }),
    [currentPage, pageSize, debouncedSearch, selectedCategory],
  );

  const { data, isLoading, isFetching, error } =
    useGetProductsQuery(queryParams);
  const { data: categories } = useGetCategoriesQuery();

  const categoryOptions = useMemo(
    () =>
      categories?.map((cat) => ({
        label: cat.name,
        value: cat.slug,
      })) ?? [],
    [categories],
  );

  const columns: ColumnsType<Product> = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "thumbnail",
        key: "thumbnail",
        width: 80,
        render: (thumbnail: string) => (
          <img
            src={thumbnail}
            alt="product"
            className="product-table__thumbnail"
          />
        ),
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        sorter: (a, b) => a.title.localeCompare(b.title),
        render: (title: string) => (
          <span className="product-table__title">{title}</span>
        ),
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        width: 120,
        sorter: (a, b) => a.price - b.price,
        render: (price: number) => (
          <span className="font-semibold text-green-600">
            ${price.toFixed(2)}
          </span>
        ),
      },
      {
        title: "Rating",
        dataIndex: "rating",
        key: "rating",
        width: 180,
        sorter: (a, b) => a.rating - b.rating,
        render: (rating: number) => (
          <Rate
            disabled
            defaultValue={rating}
            allowHalf
            style={{ fontSize: 14 }}
          />
        ),
      },
      {
        title: "Stock",
        dataIndex: "stock",
        key: "stock",
        width: 100,
        sorter: (a, b) => a.stock - b.stock,
        render: (stock: number) => (
          <Tag color={stock > 50 ? "green" : stock > 10 ? "orange" : "red"}>
            {stock}
          </Tag>
        ),
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        width: 150,
        render: (category: string) => <Tag color="blue">{category}</Tag>,
      },
      {
        title: "Action",
        key: "action",
        width: 100,
        render: (_, record) => (
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/products/${record.id}`)}
          >
            View
          </Button>
        ),
      },
    ],
    [navigate],
  );

  if (error) {
    return (
      <div className="page-container error-container">
        <Alert
          message="Error Loading Products"
          description="Something went wrong while fetching products. Please try again later."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-header__title">Products</h1>
        <p className="page-header__subtitle">Browse and manage all products</p>
      </div>

      <div className="filters-bar">
        <Input
          placeholder="Search products..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={handleSearchChange}
          allowClear
          style={{ width: 300 }}
          size="large"
        />
        <Select
          placeholder="Filter by category"
          allowClear
          value={selectedCategory}
          onChange={handleCategoryChange}
          options={categoryOptions}
          style={{ width: 220 }}
          size="large"
          showSearch
          filterOption={(input, option) =>
            (option?.label as string)
              ?.toLowerCase()
              .includes(input.toLowerCase())
          }
        />

        <div className="filters-bar__right">
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            options={PAGE_SIZE_OPTIONS.map((value) => ({
              label: `${value} / page`,
              value,
            }))}
            style={{ width: 130 }}
            size="large"
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="product-table">
          <Table<Product>
            columns={columns}
            dataSource={data?.products}
            rowKey="id"
            loading={isFetching}
            pagination={{
              current: currentPage,
              pageSize,
              total: data?.total ?? 0,
              onChange: (page) => setCurrentPage(page),
              showSizeChanger: false,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} products`,
            }}
            scroll={{ x: 800 }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;

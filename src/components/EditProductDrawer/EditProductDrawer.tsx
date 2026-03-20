import React, { useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  message,
  Select,
} from "antd";
import type { Product } from "../../types/product";
import {
  useUpdateProductMutation,
  useGetCategoriesQuery,
} from "../../redux/api/productsApi";

interface EditProductDrawerProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

const EditProductDrawer: React.FC<EditProductDrawerProps> = ({
  open,
  product,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: categories } = useGetCategoriesQuery();

  useEffect(() => {
    if (product && open) {
      form.setFieldsValue({
        title: product.title,
        description: product.description,
        price: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        brand: product.brand,
        category: product.category,
      });
    }
  }, [product, open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (product) {
        await updateProduct({ id: product.id, data: values }).unwrap();
        message.success("Product updated successfully!");
        onClose();
      }
    } catch (error) {
      if (error && typeof error === "object" && "errorFields" in error) {
        return; // validation error — form will show inline errors
      }
      message.error("Failed to update product.");
    }
  };

  return (
    <Drawer
      title="Edit Product"
      placement="right"
      width={520}
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" loading={isUpdating} onClick={handleSubmit}>
            Save Changes
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item
          name="title"
          label="Product Title"
          rules={[
            { required: true, message: "Please enter the product title" },
            { min: 3, message: "Title must be at least 3 characters" },
            { max: 100, message: "Title cannot exceed 100 characters" },
          ]}
        >
          <Input placeholder="Enter product title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter a description" },
            { min: 10, message: "Description must be at least 10 characters" },
            { max: 1000, message: "Description cannot exceed 1000 characters" },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Enter product description" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="price"
            label="Price ($)"
            rules={[
              { required: true, message: "Please enter the price" },
              {
                type: "number",
                min: 0.01,
                message: "Price must be greater than 0",
              },
              {
                type: "number",
                max: 99999.99,
                message: "Price cannot exceed $99,999.99",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              precision={2}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item
            name="discountPercentage"
            label="Discount (%)"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Discount cannot be negative",
              },
              {
                type: "number",
                max: 100,
                message: "Discount cannot exceed 100%",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              precision={2}
              placeholder="0.00"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="stock"
            label="Stock"
            rules={[
              { required: true, message: "Please enter stock quantity" },
              {
                type: "number",
                min: 0,
                message: "Stock cannot be negative",
              },
              {
                validator: (_, value) =>
                  Number.isInteger(value)
                    ? Promise.resolve()
                    : Promise.reject("Stock must be a whole number"),
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              precision={0}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            name="brand"
            label="Brand"
            rules={[
              { max: 50, message: "Brand name cannot exceed 50 characters" },
            ]}
          >
            <Input placeholder="Enter brand name" />
          </Form.Item>
        </div>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            placeholder="Select category"
            options={categories?.map((c) => ({
              label: c.name,
              value: c.slug,
            }))}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditProductDrawer;

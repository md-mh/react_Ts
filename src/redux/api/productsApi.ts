import { api } from "./api";
import type {
  Product,
  ProductsResponse,
  ProductCategory,
  ProductQueryParams,
} from "../../types/product";

const productsListTag = { type: "Products" as const, id: "LIST" };
const productTag = (id: number) => ({ type: "Product" as const, id });
const productsTag = (id: number) => ({ type: "Products" as const, id });

export const productsApi = api
  .enhanceEndpoints({
    addTagTypes: ["Product", "Products"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getProducts: builder.query<ProductsResponse, ProductQueryParams>({
        query: ({ limit, skip, q, category }) => {
          if (q) {
            return `/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`;
          }
          if (category) {
            return `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
          }
          return `/products?limit=${limit}&skip=${skip}`;
        },
        providesTags: (result) =>
          result?.products
            ? [...result.products.map(({ id }) => productsTag(id)), productsListTag]
            : [productsListTag],
      }),

      getProductById: builder.query<Product, number>({
        query: (id) => `/products/${id}`,
        providesTags: (_result, _error, id) => [productTag(id)],
      }),

      getCategories: builder.query<ProductCategory[], void>({
        query: () => "/products/categories",
      }),

      updateProduct: builder.mutation<
        Product,
        { id: number; data: Partial<Product> }
      >({
        query: ({ id, data }) => ({
          url: `/products/${id}`,
          method: "PUT",
          body: data,
        }),
        async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
          const patchDetail = dispatch(
            productsApi.util.updateQueryData("getProductById", id, (draft) => {
              Object.assign(draft, data);
            }),
          );
          try {
            await queryFulfilled;
          } catch {
            patchDetail.undo();
          }
        },
        invalidatesTags: (_result, _error, { id }) => [productTag(id), productsListTag],
      }),
    }),
  });

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} = productsApi;

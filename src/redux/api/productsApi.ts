import { api } from "./api";
import type {
  Product,
  ProductsResponse,
  ProductCategory,
  ProductQueryParams,
} from "../../types/product";

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
          result
            ? [
                ...result.products.map(({ id }) => ({
                  type: "Products" as const,
                  id,
                })),
                { type: "Products", id: "LIST" },
              ]
            : [{ type: "Products", id: "LIST" }],
      }),

      getProductById: builder.query<Product, number>({
        query: (id) => `/products/${id}`,
        providesTags: (_result, _error, id) => [{ type: "Product", id }],
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
          // Optimistic update for product detail
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
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Product", id },
          { type: "Products", id: "LIST" },
        ],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} = productsApi;

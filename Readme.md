# Product Store

A product management application built with React, TypeScript, Redux Toolkit, RTK Query, and Ant Design.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react_Ts

# Install dependencies
npm install

# Start development server
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Layer            | Technology                        |
| ---------------- | --------------------------------- |
| Framework        | React 19 + TypeScript             |
| State Management | Redux Toolkit                     |
| Data Fetching    | RTK Query                         |
| UI Components    | Ant Design 6                      |
| Styling          | SCSS + Styled Components          |
| Routing          | React Router v7                   |
| Persistence      | Redux Persist                     |
| API              | DummyJSON (https://dummyjson.com) |

## Architecture Decisions

- The project is organized by responsibility using `pages`, `components`, `redux`, `types`, and `styles`.
- RTK Query is used for server state to handle fetching, caching, loading, errors, and mutations with less boilerplate.
- The API layer is split into a shared base API and a product-specific API slice for cleaner separation.
- Tag-based invalidation and optimistic updates keep product data fast and consistent after edits.
- Shared TypeScript types keep API responses, props, and form data strongly typed across the app.
- Routing and layout are separated so pages stay focused on feature logic.
- Styling combines Ant Design, SCSS, and styled-components based on where each works best.
- Redux Persist is configured, but the RTK Query cache is excluded to avoid stale persisted API data.
- Form validation is kept close to the edit form for simpler maintenance.

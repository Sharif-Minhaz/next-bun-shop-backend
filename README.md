# API Routes information

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open

```sh
http://localhost:3000
```

## Authentication Routes

### Get All Users

-   **Method**: `GET`
-   **URL Path**: `/api/v1/auth`
-   **Description**: Retrieves a list of all users.

### User Login

-   **Method**: `POST`
-   **URL Path**: `/api/v1/auth/login`
-   **Description**: Logs in a user.

### User Registration

-   **Method**: `POST`
-   **URL Path**: `/api/v1/auth/registration`
-   **Description**: Registers a new user.

### User Logout

-   **Method**: `POST`
-   **URL Path**: `/api/v1/auth/logout`
-   **Description**: Logs out the current user.

## Order Routes

### Get All Orders

-   **Method**: `GET`
-   **URL Path**: `/api/v1/order`
-   **Description**: Retrieves a list of all orders.

### Add Order

-   **Method**: `POST`
-   **URL Path**: `/api/v1/order/add/:productId`
-   **Description**: Adds a new order.

### Cancel Order

-   **Method**: `PATCH`
-   **URL Path**: `/api/v1/order/cancel/:orderId`
-   **Description**: Cancels an order.

### Accept Order

-   **Method**: `PATCH`
-   **URL Path**: `/api/v1/order/accept/:orderId`
-   **Description**: Accepts an order.

### Get User Orders

-   **Method**: `GET`
-   **URL Path**: `/api/v1/order/:userId`
-   **Description**: Retrieves orders for a specific user.

### Delete Order

-   **Method**: `DELETE`
-   **URL Path**: `/api/v1/order/:orderId`
-   **Description**: Deletes an order.

## Product Routes

### Get All Products

-   **Method**: `GET`
-   **URL Path**: `/api/v1/product`
-   **Description**: Retrieves a list of all products.

### Get Single Product

-   **Method**: `GET`
-   **URL Path**: `/api/v1/product/:productId`
-   **Description**: Retrieves details of a single product.

### Add Product

-   **Method**: `POST`
-   **URL Path**: `/api/v1/product/add`
-   **Description**: Adds a new product.

### Update Product

-   **Method**: `PATCH`
-   **URL Path**: `/api/v1/product/update/:productId`
-   **Description**: Updates details of a product.

### Delete Product

-   **Method**: `DELETE`
-   **URL Path**: `/api/v1/product/:productId`
-   **Description**: Deletes a product.

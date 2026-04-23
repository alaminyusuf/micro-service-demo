# API Documentation

This document describes the API endpoints for the Users Service and Listings Service.

## Users Service (Port 7101)

### Get All Users
* **URL:** `/users`
* **Method:** `GET`
* **Success Response:**
    * **Code:** 200
    * **Content:** `[{ "id": "uuid", "email": "user@example.com", "createdAt": "...", "updatedAt": "..." }]`

### Create User
* **URL:** `/users`
* **Method:** `POST`
* **Data Params:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
* **Success Response:**
    * **Code:** 201
    * **Content:** `{ "id": "uuid", "email": "user@example.com", "createdAt": "...", "updatedAt": "..." }`

### Get User by ID
* **URL:** `/users/:userId`
* **Method:** `GET`
* **Success Response:**
    * **Code:** 200
    * **Content:** `{ "id": "uuid", "email": "user@example.com", "createdAt": "...", "updatedAt": "..." }`
* **Error Response:**
    * **Code:** 404
    * **Content:** `{ "error": { "message": "User not found", "status": 404 } }`

### Update User
* **URL:** `/users/:userId`
* **Method:** `PUT`
* **Data Params:**
    ```json
    {
      "email": "new-email@example.com",
      "password": "new-password123"
    }
    ```
* **Success Response:**
    * **Code:** 200
    * **Content:** `{ "id": "uuid", "email": "new-email@example.com", "createdAt": "...", "updatedAt": "..." }`

### Delete User
* **URL:** `/users/:userId`
* **Method:** `DELETE`
* **Success Response:**
    * **Code:** 204

---

## Listings Service (Port 7100)

### Get All Listings
* **URL:** `/listings`
* **Method:** `GET`
* **Success Response:**
    * **Code:** 200
    * **Content:** `{ "listings": [{ "id": 1, "title": "Listing Title", "description": "Listing Description", "createdAt": "...", "updatedAt": "..." }] }`

### Create Listing
* **URL:** `/listings`
* **Method:** `POST`
* **Data Params:**
    ```json
    {
      "title": "New Listing",
      "description": "New Description"
    }
    ```
* **Success Response:**
    * **Code:** 201
    * **Content:** `{ "id": 1, "title": "New Listing", "description": "New Description", "createdAt": "...", "updatedAt": "..." }`

### Get Listing by ID
* **URL:** `/listings/:listingId`
* **Method:** `GET`
* **Success Response:**
    * **Code:** 200
    * **Content:** `{ "id": 1, "title": "Listing Title", "description": "Listing Description", "createdAt": "...", "updatedAt": "..." }`
* **Error Response:**
    * **Code:** 404
    * **Content:** `{ "error": { "message": "Listing not found", "status": 404 } }`

### Update Listing
* **URL:** `/listings/:listingId`
* **Method:** `PUT`
* **Data Params:**
    ```json
    {
      "title": "Updated Title",
      "description": "Updated Description"
    }
    ```
* **Success Response:**
    * **Code:** 200
    * **Content:** `{ "id": 1, "title": "Updated Title", "description": "Updated Description", "createdAt": "...", "updatedAt": "..." }`

### Delete Listing
* **URL:** `/listings/:listingId`
* **Method:** `DELETE`
* **Success Response:**
    * **Code:** 204

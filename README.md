# PetCare+ Admin Dashboard

## Project Overview

The PetCare+ Admin Dashboard is a comprehensive frontend application designed to manage various aspects of the PetCare+ ecosystem. Built with Vue.js, TypeScript, and Vite, it provides a clean, responsive, and intuitive user interface leveraging the Tabler.io framework. This dashboard allows administrators to manage users, appointments, customers, pets, and system settings, as well as view reports and integrate with the backend API.

## Key Technologies

*   **Vue.js 3**: A progressive JavaScript framework for building user interfaces.
*   **TypeScript**: A superset of JavaScript that adds static typing.
*   **Vite**: A fast build tool that provides a lightning-fast development experience.
*   **Pinia**: A lightweight and intuitive state management library for Vue.js.
*   **Vue Router**: The official router for Vue.js, enabling seamless navigation.
*   **Tabler.io**: A free and open-source dashboard UI kit built on Bootstrap.
*   **Axios**: A promise-based HTTP client for making API requests.
*   **Chart.js**: Flexible JavaScript charting for designers & developers.
*   **Vue Chart.js**: Vue.js wrapper for Chart.js.

## Project Structure

The project follows a standard Vue.js application structure, with a clear separation of concerns:

```
petcare-admin/
├── public/                 # Static assets (e.g., favicon.ico)
├── src/
│   ├── assets/             # CSS, images, and other static files
│   ├── components/         # Reusable Vue components (e.g., buttons, forms, modals)
│   │   ├── forms/          # Form-specific input components
│   │   └── icons/          # SVG icons
│   ├── router/             # Vue Router configuration and routes
│   ├── services/           # API service modules for interacting with the backend
│   ├── stores/             # Pinia stores for state management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions (e.g., authentication helpers, logger)
│   ├── views/              # Vue components representing different pages/views
│   ├── App.vue             # Main application component
│   ├── axios.ts            # Axios instance configuration
│   ├── main.ts             # Main entry point of the application
│   └── vite-env.d.ts       # Vite environment type definitions
├── .env.development        # Environment variables for development
├── .env.production         # Environment variables for production
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── README.md               # This documentation file
├── tsconfig.app.json       # TypeScript configuration for the application
├── tsconfig.json           # Base TypeScript configuration
├── tsconfig.node.json      # TypeScript configuration for Node.js environment
└── vite.config.ts          # Vite build configuration
```

## Installation and Setup

To get the PetCare+ Admin Dashboard up and running on your local machine, follow these steps:

### Prerequisites

*   **Node.js**: Ensure you have Node.js (LTS version recommended) installed. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** or **Yarn**: These package managers are included with Node.js.

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/petcare-admin.git
cd petcare-admin
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env.development` file in the `petcare-admin/` directory and configure your API base URL. This file is used during development.

Example `petcare-admin/.env.development`:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

Replace `http://localhost:8080/api` with the actual URL of your Spring Boot backend API.

### 4. Run the Development Server

```bash
npm run dev
```

This command will start the development server, typically at `http://localhost:3000`, and open the application in your default browser. The application will hot-reload on code changes.

## Build and Deployment

### Type-Check, Compile and Minify for Production

```bash
npm run build
```

This command will generate a `dist` directory containing the optimized production build.

### Preview Production Build Locally

```bash
npm run preview
```

### Lint and Fix files

```bash
npm lint
```

### Format files

```bash
npm format
```

## Deployment Instructions

The `npm run build` command generates a production-ready bundle in the `dist` directory. To deploy the application, you need to serve the contents of this `dist` directory using a static web server or a CDN.

Here are basic steps for common deployment scenarios:

### 1. Static Web Server (e.g., Nginx, Apache)

Configure your web server to serve the `dist` directory.

**Example (Nginx):**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /path/to/petcare-admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 2. CDN (e.g., Netlify, Vercel, AWS S3 + CloudFront)

Most CDNs or static site hosting services allow you to simply upload the contents of your `dist` directory.

-   **Netlify/Vercel:** Connect your Git repository, and they will automatically detect the `dist` directory and deploy it.
-   **AWS S3 + CloudFront:** Upload the contents of `dist` to an S3 bucket configured for static website hosting, and then use CloudFront for global distribution and caching.

### Environment Variables for Production

For production builds, ensure your `VITE_API_BASE_URL` and other environment variables are correctly set. Vite uses `.env.production` for production-specific variables.

Example `petcare-admin/.env.production`:

```
VITE_API_BASE_URL=https://api.yourproductiondomain.com
```

Remember to rebuild the application (`npm run build`) after changing environment variables.

## How to Run Tests

Currently, there are no dedicated unit or integration tests implemented. However, the project is configured to support testing frameworks. Future development will include comprehensive tests to ensure application stability and reliability.

To run type checks:

```bash
npm run type-check
```

## Component Usage

The PetCare+ Admin Dashboard utilizes a set of reusable Vue components to maintain consistency and accelerate development. Here's an overview of some key components:

### `FormInput.vue`

A versatile input component for various text-based inputs.

*   **Location:** `src/components/forms/FormInput.vue`
*   **Props:**
    *   `id` (String, required): Unique ID for the input.
    *   `label` (String, required): Label text displayed above the input.
    *   `type` (String, default: 'text'): HTML input type (e.g., 'text', 'email', 'password', 'number').
    *   `modelValue` (String/Number): The bound value of the input.
    *   `placeholder` (String): Placeholder text.
    *   `required` (Boolean, default: false): Indicates if the input is required.
    *   `disabled` (Boolean, default: false): Disables the input.
    *   `error` (String): Error message to display below the input.
*   **Events:**
    *   `update:modelValue`: Emitted when the input value changes.

**Example Usage:**

```vue
<template>
  <FormInput
    id="username"
    label="Username"
    type="text"
    v-model="formData.username"
    placeholder="Enter your username"
    :required="true"
    :error="errors.username"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FormInput from '@/components/forms/FormInput.vue';

const formData = ref({ username: '' });
const errors = ref({ username: '' });
</script>
```

### `DataTable.vue`

A generic table component for displaying tabular data with pagination and sorting capabilities.

*   **Location:** `src/components/DataTable.vue`
*   **Props:**
    *   `headers` (Array<Object>, required): Array of header objects. Each object should have `key` (String) and `label` (String).
    *   `items` (Array<Object>, required): Array of data objects to display.
    *   `totalItems` (Number, required): Total number of items for pagination.
    *   `itemsPerPage` (Number, default: 10): Number of items to display per page.
    *   `currentPage` (Number, default: 1): Current page number.
    *   `loading` (Boolean, default: false): Shows a loading indicator.
*   **Events:**
    *   `page-change`: Emitted when the page changes, with the new page number.
    *   `sort-change`: Emitted when sorting criteria change, with `{ sortBy, sortDesc }`.

**Example Usage:**

```vue
<template>
  <DataTable
    :headers="userHeaders"
    :items="users"
    :totalItems="totalUsers"
    :itemsPerPage="10"
    :currentPage="currentPage"
    @page-change="handlePageChange"
    @sort-change="handleSortChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTable from '@/components/DataTable.vue';

const userHeaders = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
];
const users = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
]);
const totalUsers = ref(2);
const currentPage = ref(1);

const handlePageChange = (page: number) => {
  console.log('New page:', page);
  currentPage.value = page;
};

const handleSortChange = (sort: { sortBy: string; sortDesc: boolean }) => {
  console.log('Sort by:', sort.sortBy, 'Desc:', sort.sortDesc);
};
</script>
```

### `Modal.vue`

A flexible modal component for displaying dialogs and overlays.

*   **Location:** `src/components/Modal.vue`
*   **Props:**
    *   `show` (Boolean, required): Controls the visibility of the modal.
    *   `title` (String, required): Title displayed in the modal header.
    *   `size` (String, default: 'md'): Size of the modal ('sm', 'md', 'lg', 'xl').
    *   `staticBackdrop` (Boolean, default: false): Prevents closing when clicking outside.
*   **Events:**
    *   `close`: Emitted when the modal is requested to be closed (e.g., by clicking the close button or backdrop).

**Example Usage:**

```vue
<template>
  <button @click="showModal = true">Open Modal</button>
  <Modal :show="showModal" title="Example Modal" @close="showModal = false">
    <p>This is the content of the modal.</p>
    <template #footer>
      <button class="btn btn-primary" @click="showModal = false">Close</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '@/components/Modal.vue';

const showModal = ref(false);
</script>
```

### `ToastNotification.vue`

A component for displaying transient, non-intrusive messages (toasts).

*   **Location:** `src/components/ToastNotification.vue`
*   **Props:**
    *   `message` (String, required): The message to display.
    *   `type` (String, default: 'info'): Type of notification ('success', 'error', 'warning', 'info').
    *   `show` (Boolean, required): Controls the visibility of the toast.
    *   `duration` (Number, default: 3000): How long the toast is visible in milliseconds.
*   **Events:**
    *   `close`: Emitted when the toast is closed (either by timeout or user action).

**Example Usage (typically managed by a global notification store):**

```vue
<template>
  <ToastNotification
    :show="notification.show"
    :message="notification.message"
    :type="notification.type"
    @close="clearNotification"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import ToastNotification from '@/components/ToastNotification.vue';

const notificationStore = useNotificationStore();
const notification = computed(() => notificationStore.currentNotification);

const clearNotification = () => {
  notificationStore.clearNotification();
};
</script>
```

## API Integration Guide

The PetCare+ Admin frontend application communicates with a Spring Boot backend API to fetch and manage data. This section outlines how the frontend interacts with the API, including service structure, authentication, and error handling.

### API Services

API interactions are organized into service modules located in `src/services/`. Each service is responsible for making HTTP requests related to a specific domain. The main Axios instance is configured in `src/axios.ts`.

Key service modules include:

*   **`auth.service.ts`**: Handles user authentication, login, logout, and token management.
*   **`user.service.ts`**: Manages user-related operations, such as fetching user lists, creating, updating, and deleting users.
*   **`dashboard.service.ts`**: Provides data for the dashboard, including statistics and summaries.
*   **`settings.service.ts`**: Manages application settings and configurations.
*   **`appointments.service.ts`**: Handles operations related to appointments.
*   **`customers.service.ts`**: Manages customer data.
*   **`pets.service.ts`**: Manages pet data.

**Example (`auth.service.ts` snippet):**

```typescript
// src/services/auth.service.ts
import axios from '@/axios';
import type { LoginPayload, AuthResponse } from '@/types/api';

class AuthService {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await axios.post('/auth/login', payload);
    return response.data;
  }

  logout(): void {
    // Clear tokens and user data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Redirect to login page
  }
}

export default new AuthService();
```

### Authentication (JWT)

The application uses JSON Web Tokens (JWT) for authentication.

1.  **Login**: Upon successful login, the backend returns an `accessToken` and a `refreshToken`.
2.  **Token Storage**: The `accessToken` and `refreshToken` are stored in `localStorage` for persistence.
3.  **Request Interception**: An Axios interceptor (configured in `src/axios.ts`) automatically attaches the `accessToken` to the `Authorization` header of outgoing requests.
4.  **Token Refresh**: If an `accessToken` expires, the interceptor attempts to use the `refreshToken` to obtain a new `accessToken` from a dedicated refresh endpoint. If the refresh fails, the user is logged out.

**Axios Interceptor (`src/axios.ts` snippet):**

```typescript
// src/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import router from '@/router';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();

    // Handle token expiration and refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await authStore.refreshToken(); // Attempt to refresh token
        return instance(originalRequest); // Retry original request with new token
      } catch (refreshError) {
        authStore.logout();
        notificationStore.showNotification('Session expired. Please log in again.', 'error');
        router.push('/login');
        return Promise.reject(refreshError);
      }
    }

    // Generic error handling
    if (error.response && error.response.data && error.response.data.message) {
      notificationStore.showNotification(error.response.data.message, 'error');
    } else {
      notificationStore.showNotification('An unexpected error occurred.', 'error');
    }

    return Promise.reject(error);
  }
);

export default instance;
```

### Handling API Errors and Displaying Notifications

The Axios response interceptor (as shown above) is also responsible for global error handling:

*   **Specific Error Messages**: If the API returns an error message (e.g., `error.response.data.message`), it is displayed to the user using the `ToastNotification` component, managed by the `notification` Pinia store (`src/stores/notification.ts`).
*   **Generic Error Messages**: For unhandled or unexpected errors, a generic error message is displayed.
*   **Session Expiration**: A specific flow handles 401 (Unauthorized) errors, attempting token refresh and redirecting to the login page if the session truly expires.

### Environment Variable Configuration for API Endpoints

The base URL for the API is configured using environment variables, managed by Vite.

*   **Development**: Use `.env.development` (e.g., `VITE_API_BASE_URL=http://localhost:8080/api`).
*   **Production**: Use `.env.production` (e.g., `VITE_API_BASE_URL=https://api.yourproductiondomain.com`).

Ensure these files are correctly set up in your respective environments. The `VITE_API_BASE_URL` variable is accessed in the code via `import.meta.env.VITE_API_BASE_URL`.

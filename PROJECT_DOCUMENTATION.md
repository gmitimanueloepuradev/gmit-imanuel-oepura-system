# GMIT Imanuel Oepura - Project Documentation

## 1. Project Overview

This document provides a comprehensive overview of the GMIT Imanuel Oepura application. It is a web-based system designed to manage church congregation data, activities, finances, and internal documentation. The application is built with a modern technology stack and features role-based access control to cater to the different needs of administrators, church council members (Majelis), and general congregation members (Jemaat).

The system serves as a central hub for:
-   Demographic data management of the congregation.
-   Scheduling and management of church services and events.
-   Financial planning, budgeting, and transaction recording.
-   Publication of church news and announcements.
-   Management of official church documents and member records (baptism, marriage, etc.).
-   Photo gallery of church activities.

---

## 2. Technology Stack

The project is a full-stack application built primarily with JavaScript/TypeScript.

### **Frontend:**
-   **Framework:** [Next.js](https://nextjs.org/) (v15) with React (v19)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4) with [DaisyUI](https://daisyui.com/) component library.
-   **State Management:** [React Query](https://tanstack.com/query) for server-state management, caching, and data fetching.
-   **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.
-   **UI Components:** [Lucide React](https://lucide.dev/guide/react) for icons, [Sonner](https://sonner.emilkowal.ski/) for notifications, [Recharts](https://recharts.org/) for charts.
-   **Mapping:** [Leaflet](https://leafletjs.com/) and [React Leaflet](https://react-leaflet.js.org/) for geographic data visualization.

### **Backend:**
-   **Framework:** Next.js API Routes.
-   **Database:** [PostgreSQL](https://www.postgresql.org/).
-   **ORM:** [Prisma](https://www.prisma.io/) (v6) is used for database access, migrations, and schema management.
-   **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/) and `bcrypt` for password hashing.
-   **File Storage:** [Amazon S3](https://aws.amazon.com/s3/) (or a compatible object storage service like `s3.nevaobjects.id`) for storing user-uploaded documents and images.

### **Development & Tooling:**
-   **Package Manager:** `npm`.
-   **Linting:** [ESLint](https://eslint.org/).
-   **Development Server:** Next.js development server.
-   **Mobile:** [Capacitor](https://capacitorjs.com/) configuration is present, indicating the potential for building and deploying the application as a native mobile app.

---

## 3. Project Structure

The codebase is organized into several key directories:

-   `src/pages/`: Contains the application's pages and API routes. The file structure here directly maps to the URL paths.
    -   `src/pages/api/`: Backend API endpoints. Each file or folder corresponds to a RESTful resource.
    -   `src/pages/[admin|majelis|jemaat|employee]/`: Frontend pages restricted to specific user roles.
-   `src/components/`: Reusable React components used throughout the application.
-   `src/lib/`: Core utility functions, API handlers, database clients (`prisma.js`), and authentication logic.
-   `src/hooks/`: Custom React hooks for shared logic (e.g., `useUser`, `useConfirm`).
-   `src/contexts/`: React context providers for managing global state like authentication (`AuthContext.jsx`).
-   `prisma/`: Contains the database schema (`schema.prisma`) and migration history.
-   `public/`: Static assets like images, logos, and manifest files.
-   `scripts/`: Node.js scripts for database seeding and other administrative tasks.

---

## 4. User Roles & Features

The system defines five user roles, with features tailored to their responsibilities. The roles are defined in `prisma/schema.prisma` as `ADMIN`, `JEMAAT`, `MAJELIS`, `EMPLOYEE`, and `PENDETA`.

### **A. Public / Unauthenticated User**

Users who are not logged in can access a limited set of public-facing pages.

-   **Home Page:** View general information, possibly news highlights and upcoming events.
-   **Login:** Access the login page to authenticate.
-   **About/History:** View pages about the church's history and vision (`/sejarah`, `/tentang`).
-   **Gallery:** View public photo galleries of church events (`/galeri`).
-   **Pastor Profiles:** View profiles of the church pastors (`/profil-pendeta`).

### **B. Jemaat (Congregation Member)**

This is the standard user role for registered members of the church.

-   **Dashboard:** View a personalized dashboard.
-   **Profile Management:** View and manage their personal and family data.
-   **Document Management:** Upload and view personal church documents (e.g., Baptism Certificate, Marriage Certificate).
-   **View Schedules:** Access schedules for various church services and events.
-   **View Announcements:** Read church-wide announcements.

### **C. Majelis (Church Council Member)**

This role has expanded permissions to manage church operations within their designated region (Rayon).

-   **All Jemaat Features.**
-   **Congregation Data Management:** Manage congregation (`Jemaat`) and family (`Keluarga`) data within their Rayon.
-   **Schedule Management:** Create, update, and delete worship schedules (`Jadwal Ibadah`) for their Rayon.
-   **Announcement Management:** May have permissions to create or manage announcements.
-   **Financial Data Entry:** May be responsible for recording financial transactions related to their Rayon or specific events.

### **D. Employee**

This role is likely for administrative staff who manage church-wide data.

-   **Data Management:** Broader access to manage core church data, potentially across all Rayons. This includes:
    -   Congregation data (Jemaat, Keluarga).
    -   Master data (e.g., occupations, education levels, regions).
    -   Atestasi (member transfers).
-   **Financial Management:** Manage financial periods, budgets (`ItemKeuangan`), and record financial realizations (`RealisasiItemKeuangan`).
-   **Content Management:** Manage announcements (`Pengumuman`) and photo galleries (`Galeri`).

### **E. ADMIN (System Administrator)**

The ADMIN role has full superuser access to the entire system.

-   **All Employee and Majelis Features.**
-   **User Management:** Create, view, update, and delete user accounts (`User`) for all roles.
-   **System Configuration:** Manage system-wide settings and master data categories.
-   **Database Management:** Full control over all data models defined in the Prisma schema.
-   **Security & Access Control:** Define and manage roles and permissions.
-   **Document Verification:** Approve or reject documents uploaded by congregation members.

---

## 5. Database Schema Overview

The database schema is defined in `prisma/schema.prisma` and uses PostgreSQL. It is well-structured and normalized, covering various aspects of church management.

### **Core Data Models:**
-   **`User`**: Stores user accounts, credentials, and roles. Linked to `Jemaat` or `Majelis`.
-   **`Jemaat`**: Represents an individual congregation member. Contains detailed personal, demographic, and status information.
-   **`Keluarga`**: Represents a family unit, linking multiple `Jemaat` members together. Associated with an address and a `Rayon`.
-   **`Rayon`**: A geographical or organizational division within the church.

### **Church Activities & Records:**
-   **`JadwalIbadah`**: Stores information about all church services, including type, time, location, and leader.
-   **`Pengumuman`**: A detailed model for church announcements, with categories, priorities, and dynamic content.
-   **`Galeri`**: Manages photo galleries for church events.
-   **`Baptis`, `Sidi`, `Pernikahan`, `Atestasi`**: Models for recording key life events and membership status changes for a `Jemaat`.

### **Financial Models:**
-   **`PeriodeAnggaran`**: Defines financial periods (e.g., "Anggaran 2025").
-   **`KategoriKeuangan`**: Top-level categories ("PENERIMAAN", "PENGELUARAN").
-   **`ItemKeuangan`**: A hierarchical model for budgeting, allowing for nested budget items with targets.
-   **`RealisasiItemKeuangan`**: Records actual financial transactions against a specific budget item.

### **Document Management:**
-   **`DokumenJemaat`**: Manages files uploaded by members (e.g., baptism certificates), including their verification status and S3 storage URL.

### **Master Data:**
-   The schema includes numerous tables for master data, such as `Provinsi`, `Pekerjaan`, `Pendidikan`, `Suku`, etc., which act as lookup tables to ensure data consistency.

---

## 6. Getting Started

To run this project in a development environment, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables:**
    Create a `.env` file in the project root and populate it with the necessary values, especially the `DATABASE_URL` for Prisma.
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    # Add other variables for JWT secret, AWS S3, etc.
    ```

3.  **Run Database Migrations:**
    Apply the database schema changes using Prisma Migrate.
    ```bash
    npx prisma migrate dev
    ```

4.  **(Optional) Seed the Database:**
    If seed scripts are available, run them to populate the database with initial data.
    ```bash
    npm run seed
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

The application should now be running at [http://localhost:3000](http://localhost:3000).

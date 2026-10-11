# STITCHORA – Smart Tailoring Management Platform

A modern web application designed to simplify tailoring services by connecting customers, tailors, and administrators through a single platform.

## 📌 Project Overview

**STITCHORA** is a tailoring management platform that helps customers manage tailoring requirements and allows tailors to handle customer orders, measurements, appointments, and service availability. The platform provides a centralized interface for managing tailoring-related activities.

## ✨ Key Features

### 👤 Customer
- Customer registration and login
- Customer profile and dashboard
- Tailor discovery and availability status
- Measurement management
- Tailoring order management
- Appointment management
- Tailor ratings and reviews

### 🧵 Tailor
- Tailor dashboard
- Availability status management
- Customer order and appointment management
- Customer review and rating visibility

### 🛡️ Administrator
- Administrative login
- Access to the platform's administrative features

*Feature availability depends on the implemented backend functionality and user permissions.*

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Development server and build tool |
| JavaScript | Application logic |
| CSS | Styling and responsive layouts |
| Axios | HTTP communication with the backend |
| Java & Spring Boot | Backend services |
| MySQL | Database management |
| Git & GitHub | Version control and source code hosting |
| Vercel | Frontend deployment |

## 🏗️ System Architecture

The application follows a frontend–backend architecture.

```text
Customer / Tailor / Admin
          |
          v
   React + Vite UI
          |
          v
      Axios API
          |
          v
   Spring Boot Backend
          |
          v
        MySQL
```

## ⚙️ Getting Started

### Prerequisites

Install the following tools:

- Node.js and npm
- Git
- Visual Studio Code (recommended)
- Java JDK and Maven for running the backend
- MySQL for the database

### 1. Clone the Repository

```bash
git clone https://github.com/usharapaka/tailoring-frontend.git
```

### 2. Open the Project

```bash
cd tailoring-frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🔗 Live Demo

**Frontend:** https://tailoring-frontend-two.vercel.app

The frontend is deployed on Vercel. Features requiring backend connectivity depend on the backend service and database being available and correctly configured.

## 📂 Repository Structure

```text
tailoring-frontend/
├── public/
├── src/
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 🎯 Project Objective

To provide a convenient and organized digital platform for tailoring services by simplifying customer interactions, measurement handling, order tracking, appointment management, and tailor availability.

## 👩‍💻 Developer

**Rapaka Usha**  
B.Tech – Electronics and Communication Engineering  
Anurag University

GitHub: https://github.com/usharapaka

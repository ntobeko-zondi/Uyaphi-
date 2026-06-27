# Uyaphi

<p align="center">
  <img src="assets/GHBanner.png" alt="Uyaphi Banner" width="100%">
</p>

<p align="center">

**Know Before You Go**

An AI-powered commuter safety and driver verification platform designed to help passengers make informed transport decisions through driver verification, trust scoring, community reporting, and accessibility-first design.

</p>

---

## Live Demo

**Production Website**

**https://uyaphi-304072972581.europe-west2.run.app**

**AI Studio Project**

https://ai.studio/apps/f576f804-f7e3-45bb-86f1-9af7e6ce12dd

---

## Overview

Uyaphi is a modern full-stack web application that enables commuters to verify public transport drivers before entering a vehicle.

The platform combines AI-assisted driver analysis, community reporting, trust scoring, accessibility features, and an administrative operations portal into a single ecosystem focused on improving commuter safety.

Rather than functioning as another ride-booking application, Uyaphi helps users answer one important question before every journey:

> **Can I trust this driver?**

---

# Features

## Driver Verification

* Search by driver name
* Search by vehicle registration number
* View driver trust score
* View vehicle information
* Passenger review history
* Driver verification status

---

## AI Safety Intelligence

* AI-generated driver safety assessment
* Risk analysis
* Safety recommendations
* Confidence indicators
* Intelligent commuter guidance

---

## Incident Reporting

Users can report:

* Reckless driving
* Route deviations
* Harassment
* Unsafe behaviour
* Fake licence plates
* Unregistered drivers
* Vehicle impersonation

---

## Accessibility

Uyaphi was designed with accessibility as a first-class feature.

Features include:

* Voice Guidance
* Text Scaling
* Dyslexia-friendly typography
* High Contrast Mode
* Dark Mode
* Light Mode
* Keyboard accessibility
* Responsive layouts

---

## User Features

* Driver verification
* Saved search history
* Community reporting
* Achievement badges
* Printable certificates
* Personal profile management
* Theme customisation

---

## Administration Portal

Administrators can:

* Register drivers
* Edit driver information
* Delete driver records
* Moderate incident reports
* Broadcast safety alerts
* View system telemetry
* Review audit logs
* Monitor platform health

---

# Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

## Backend

* Express.js
* Node.js

## APIs

* Google Gemini API
* Web Speech API

## Development

* npm
* Git
* GitHub

---

# Architecture

```text
                 User

                   │

                   ▼

          Landing Page

                   │

                   ▼

        Driver Verification

        ┌───────────────┐
        │ Driver Search │
        │ Plate Search  │
        └───────────────┘

                   │

                   ▼

        AI Safety Assessment

                   │

          ┌───────────────┐
          │ Safe Journey  │
          │ Report Driver │
          └───────────────┘

                   │

                   ▼

        Administrator Review

                   │

                   ▼

        Community Trust Score
```

---

# Project Structure

```text
.
├── assets
├── src
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── services
│   ├── context
│   ├── utils
│   └── assets
├── server.ts
├── package.json
├── vite.config.ts
└── README.md
```

---

# Getting Started

## Prerequisites

Before running the project, ensure you have installed:

* Node.js 20+
* npm

---

## Clone the repository

```bash
git clone https://github.com/<your-username>/uyaphi.git

cd uyaphi
```

---

## Install dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a file named:

```text
.env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

You can copy the provided template:

```bash
cp .env.example .env.local
```

---

## Run the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## Build for Production

```bash
npm run build
```

---

## Preview Production Build

```bash
npm run preview
```

---

# Application Workflow

1. Open the landing page.

2. Search for a driver or vehicle registration number.

3. Review:

* Trust Score
* Driver Information
* Vehicle Details
* Passenger Reviews
* AI Safety Assessment

4. If necessary, submit an incident report.

5. Administrators review reports before publication.

6. Community trust scores are updated.

---

# Security

Uyaphi incorporates several modern software engineering practices:

* Role-Based Access Control
* Input Validation
* Error Boundary Recovery
* Session Persistence
* Local Data Storage
* Rate Limiting
* XSS Protection
* Accessibility Compliance

---

# Future Improvements

* Live GPS tracking
* Google Maps integration
* Facial verification
* Push notifications
* Real-time reporting
* Emergency contact integration
* Cloud database
* Mobile applications
* QR driver verification
* Offline synchronisation

---

# Learning Outcomes

This project strengthened practical experience in:

* Full Stack Development
* Software Architecture
* React
* TypeScript
* Express.js
* REST APIs
* Accessibility
* Responsive Design
* AI Integration
* State Management
* Authentication
* Secure Web Development

---

# Repository

```bash
git clone https://github.com/<your-username>/uyaphi.git
```

---

# Live Application

Production

https://uyaphi-304072972581.europe-west2.run.app
---

# Author

**Ntokzin S**

Computer Science Student

Full Stack Developer • Software Engineer • AI Enthusiast

---

## License

This project is licensed under the MIT License.

---

If you found this project useful or interesting, consider starring the repository.

# Freelance Platform with Microservices Architecture

A modular freelance platform designed with a microservices architecture. This MVP connects freelancers and clients with essential services for user management, real-time chat, and secure payment processing. Each service is independently managed, ensuring scalability, maintainability, and flexibility.

## Features

- **User Management**: Registration, authentication, and profile management powered by Clerk for streamlined user handling.
- **Real-time Chat**: Instant messaging with Socket.IO, allowing seamless communication between users.
- **Payment Service**: Secure, reliable payment processing with Stripe.

## Technologies

- **Main App**: Next.js 14, Typescript, PostgreSQL, React Query, Zustand, Socket.IO, Clerk
- **Chat Service**: Express.js, Typescript, MongoDB, Socket.IO
- **Payment Service**: Stripe

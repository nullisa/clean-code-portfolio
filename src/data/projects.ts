export interface Project {
  title: string;
  description: string;
  tech: string;
  link: string;
  link2?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    title: "Contact Management API",
    description: "A system for write a contact management.",
    tech: "NestJS · PostgreSQL · Prisma",
    link: "https://github.com/faridlan/contact-management-api/tree/dev",
  },
  {
    title: "Employee Tracker — Bank Galuh Ciamis",
    description: "A system for tracking employee targets and achievements for Bank Galuh Ciamis.",
    tech: "NestJS · React (TS) · SQLite",
    link: "https://github.com/faridlan/employee-tracker-backend",
    link2: "https://github.com/faridlan/employee-tracker-frontend",
  },
  {
    title: "Meeting Minutes — Bank Galuh Ciamis",
    description: "A system for write a meeting minute and result meeting of Bank Galuh Ciamis.",
    tech: "NestJS · React (TS) · SQLite",
    link: "https://github.com/faridlan/notulen-backend",
    link2: "https://github.com/faridlan/notulen-frontend",
  },
  {
    title: "WIFT Indonesia — ERP & Business Intelligence Dashboard",
    description: "Designed a relational database schema in Supabase that handles identity management and real-time data synchronization.",
    tech: "Supabase · React (TS) · Lovable UI",
    link: "https://wift.faridlan.com",
    demo: "https://wift.faridlan.com",
  },
  {
    title: "Wijaya Family — Conversion-Optimized Landing Page",
    description: "Integrated Meta Pixel events to monitor Leads and Page Views, allowing the marketing team to optimize ad spend based on real-time data captured in Supabase.",
    tech: "Supabase · React (TS) · Lovable UI",
    link: "https://wijaya.faridlan.com",
    demo: "https://wijaya.faridlan.com",
  },
  {
    title: "Inventory Management Service",
    description: "A microservice handling product stock, warehouse transfers, and low-stock alerts with event-driven architecture.",
    tech: "Go · gRPC · PostgreSQL · RabbitMQ",
    link: "https://github.com/faridlan/inventory-service",
  },
  {
    title: "Auth & Identity Provider",
    description: "OAuth2 + JWT authentication service with role-based access control, refresh tokens, and email verification flow.",
    tech: "NestJS · Redis · PostgreSQL",
    link: "https://github.com/faridlan/auth-provider",
  },
  {
    title: "Realtime Chat Backend",
    description: "WebSocket-based chat backend supporting rooms, presence, and message persistence with horizontal scaling.",
    tech: "Node.js · Socket.IO · MongoDB",
    link: "https://github.com/faridlan/realtime-chat",
    demo: "https://chat-demo.faridlan.com",
  },
  {
    title: "Payment Gateway Integration",
    description: "Unified payment abstraction layer integrating Midtrans, Stripe, and Xendit with idempotent webhook handling.",
    tech: "NestJS · PostgreSQL · Prisma",
    link: "https://github.com/faridlan/payment-gateway",
  },
  {
    title: "URL Shortener Service",
    description: "High-throughput URL shortener with click analytics, custom aliases, and rate limiting per API key.",
    tech: "Go · Redis · PostgreSQL",
    link: "https://github.com/faridlan/url-shortener",
    demo: "https://s.faridlan.com",
  },
];

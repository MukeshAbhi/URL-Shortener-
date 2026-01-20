# 🔗 URL Shortener

> A scalable, production-ready URL shortener with rate limiting, built with microservices architecture in a TypeScript monorepo.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248.svg)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D.svg)](https://upstash.com/)

## ✨ Features

- 🚀 **High Performance** - Sub-100ms URL creation, sub-50ms redirects
- 🛡️ **Rate Limiting** - Token bucket algorithm with Redis
- 🎨 **Modern UI** - React 19 with TailwindCSS and toast notifications
- 📊 **Click Tracking** - Automatic click counter for analytics
- 🔒 **Security** - Random suffixes prevent enumeration attacks
- 📦 **Monorepo** - Shared packages with pnpm workspaces
- 🎯 **Type-Safe** - Full TypeScript coverage
- 🔄 **Scalable** - Microservices architecture ready for horizontal scaling

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │  React + Vite + TailwindCSS
│  (Port 5173)│
└──────┬──────┘
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
┌──────▼──────┐   ┌──────▼──────┐   ┌─────▼─────┐
│ API Service │   │  Redirect   │   │   Redis   │
│ (Port 3000) │   │   Service   │   │ (Upstash) │
│             │   │ (Port 3001) │   │           │
└──────┬──────┘   └──────┬──────┘   └───────────┘
       │                 │
       └────────┬────────┘
                │
         ┌──────▼──────┐
         │   MongoDB   │
         │  (Storage)  │
         └─────────────┘
```

**See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture diagrams and explanations.**

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and **pnpm** 10+
- **MongoDB** instance (local or cloud)
- **Upstash Redis** account (free tier available)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd url-shortener

# Install dependencies
pnpm install

# Build shared packages
pnpm run build:packages
```

### Environment Setup

Create `.env` files in the service directories:

**`apps/api-service/.env`** and **`apps/redirect-service/.env`**:
```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/url-shortener
```

**`apps/client/.env`** (optional, defaults to localhost):
```env
VITE_API_SERVICE_URL=http://localhost:3000
VITE_REDIRECT_SERVICE_URL=http://localhost:3001
```

### Running the Application

```bash
# Start all services (API + Redirect + Client)
pnpm start

# Or start services individually:
pnpm dev:api        # API Service on port 3000
pnpm dev:redirect   # Redirect Service on port 3001
pnpm start:client   # Client on port 5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
url-shortener/
├── apps/
│   ├── client/              # React frontend
│   │   ├── src/
│   │   │   └── App.tsx      # Main UI component
│   │   └── package.json
│   ├── api-service/         # URL creation service
│   │   ├── src/
│   │   │   ├── server.ts    # Express server
│   │   │   └── utils/       # Base62, counter, env validation
│   │   └── package.json
│   └── redirect-service/    # URL redirect service
│       ├── src/
│       │   └── server.ts    # Express server
│       └── package.json
├── packages/
│   ├── db/                  # MongoDB models (Url, Counter)
│   ├── redis/               # Upstash Redis client
│   └── rate-limiter/        # Token bucket rate limiter
├── docs/
│   └── ARCHITECTURE.md      # Detailed architecture docs
└── package.json             # Root workspace config
```

## 🔌 API Reference

### API Service (Port 3000)

#### Create Short URL
```http
POST /url
Content-Type: application/json

{
  "url": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "shortUrl": "2n9Kd"
}
```

### Redirect Service (Port 3001)

#### Redirect to Original URL
```http
GET /:shortUrl
```

**Response:** `302 Redirect` to original URL

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database (Mongoose ODM)
- **Upstash Redis** - Rate limiting & caching
- **Zod** - Schema validation

## 🔐 Security Features

### 1. Rate Limiting
- **Algorithm:** Token bucket (Lua script for atomicity)
- **Limit:** 10 requests per minute per IP
- **Storage:** Redis (distributed)

### 2. Input Validation
- Client-side URL validation
- Server-side Zod schema validation
- TypeScript type checking

### 3. Random Suffixes
- 2-character random suffix per short URL
- Prevents enumeration attacks
- 3,844 combinations per sequence ID

## 📊 Performance

| Operation | Expected Time |
|-----------|---------------|
| URL Creation | < 100ms |
| URL Redirect | < 50ms |
| Rate Limit Check | < 10ms |

**Capacity:** 62^7 ≈ **3.5 trillion** unique short URLs

## 🧪 Development

### Build Commands

```bash
# Build all packages and apps
pnpm run build

# Build only shared packages
pnpm run build:packages

# Build only apps
pnpm run build:apps
```


## 📈 Scalability

### Current Setup
- Single instance per service
- MongoDB single node
- Redis (Upstash serverless)

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using TypeScript, React, Express, MongoDB, and Redis**

# WildDuck-NodeSDK

A lightweight and modular client library for interacting with the WildDuck API, designed for Node.js applications. This library simplifies API interactions by providing easy-to-use modules for authentication and other operations, enabling seamless integration into your email infrastructure.

---

## Features

- Modular design for different API operations.
- Authentication using `X-Access-Token`.
- Simple and extensible structure for future API extensions.
- Fully written in TypeScript.

---

## Installation

Install the library using npm:

```bash
npm install wildduck-nodesdk
```

---

## Usage

### Importing the Library

To use the library, first import and initialize it with your WildDuck API key and base URL:

```typescript
import { WildDuck-NodeSDK } from "wildduck-nodesdk";

const api = new WildDuck-NodeSDK("YOUR_API_KEY", "https://api.example.com");
```

### Authentication

The `authentication` module provides methods for handling authentication-related operations. For example:

#### Pre-authentication

Check if a username exists and can be authenticated:

```typescript
const response = await api.authentication.preAuth("user@example.com", "imap");
console.log("Pre-auth response:", response);
```

#### Authenticate a User

Authenticate a user and optionally generate a token:

```typescript
const authResponse = await api.authentication.authenticate(
  "user@example.com",
  "password123",
  "imap"
);
console.log("Authentication response:", authResponse);
```

#### Invalidate an Authentication Token

Invalidate the current access token:

```typescript
const invalidateResponse = await api.authentication.invalidateToken();
console.log("Token invalidation response:", invalidateResponse);
```

---

## Example Project Structure

Here’s an example of how you can organize your project when using `WildDuck-NodeSDK`:

```
my-project/
├── src/
│   ├── index.ts            # Your application's entry point
│   ├── services/
│   │   ├── wildduck.ts     # WildDuck-NodeSDK initialization
├── package.json            # Project configuration
├── tsconfig.json           # TypeScript configuration
```

---

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for bugs or feature requests.

---

## License

This project is licensed under the [EUPL v1.2](https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12).

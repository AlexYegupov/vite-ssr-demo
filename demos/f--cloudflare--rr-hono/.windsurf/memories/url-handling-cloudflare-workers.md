# URL Handling in Cloudflare Workers

Fixed URL handling in the todos.tsx loader function for Cloudflare Workers environment:

```tsx
// Before - caused "Invalid URL" error in Cloudflare Workers
export async function loader() {
  const response = await fetch('/api/todos.json');
  // ...
}

// After - properly constructs URL using request parameter
export async function loader({ request }: { request: Request }) {
  const url = new URL('/api/todos.json', request.url);
  const response = await fetch(url);
  // ...
}
```

The fix was necessary because Cloudflare Workers environment requires complete URLs for fetch calls, not just relative paths. The solution uses the request parameter provided by React Router to construct a proper URL by combining the path with the current request's origin.

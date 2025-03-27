// jest.setup.js
import '@testing-library/jest-dom'

// Mock next/router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Silence deprecation warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  // Filter out specific deprecation warnings
  if (args[0] && typeof args[0] === 'string' && args[0].includes('punycode')) {
    return;
  }
  originalWarn(...args);
}; 
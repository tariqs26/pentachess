// src/test-utils.tsx
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Dummy providers to simulate theme and translation contexts
const DummyThemeProvider: React.FC<{ theme: string; children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

const DummyTranslationProvider: React.FC<{ messages: Record<string, any>; children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>
}

// Wraps the children with our dummy providers
const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DummyThemeProvider theme="light">
      <DummyTranslationProvider messages={{}}>
        {children}
      </DummyTranslationProvider>
    </DummyThemeProvider>
  )
}

// Custom render function that wraps UI with our providers
const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })

// Re-export everything from testing library, and export our custom render
export * from '@testing-library/react'
export { customRender as render }

import React, { Suspense, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from '@/components/error-boundary';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg font-medium">Loading application...</p>
    </div>
  </div>
);

// Function to show error message in our special error container
const showErrorInContainer = (message: string) => {
  const errorContainer = document.getElementById('error-container');
  if (errorContainer) {
    errorContainer.innerHTML = `<div style="color:red; padding:20px;">
      <h1>Error Loading React</h1>
      <p>${message}</p>
      <p>Check console for details.</p>
    </div>`;
    errorContainer.style.display = 'block';
  }
};

// Add global error handler for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Unhandled error in React application:', event.error);
  showErrorInContainer(event.error?.message || 'Unknown error occurred');
});

// Debug React/ReactDOM versions
console.log('React version:', React.version);
console.log('Initializing React application...');

try {
  // Get the container element
  const container = document.getElementById('root');
  
  if (!container) {
    throw new Error('Root element not found in the document');
  }
  
  console.log('Found root element, creating React root...');
  
  // Create the root with React 19
  const root = createRoot(container, {
    onRecoverableError: (error: unknown) => {
      console.error('Recoverable error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      showErrorInContainer(errorMessage);
    }
  });
  
  console.log('Root created, rendering application...');
  
  // Render the app with React 19 features
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </StrictMode>
  );
  
  console.log('React application mounted successfully');
} catch (error) {
  console.error('Error mounting React application:', error);
  showErrorInContainer(error instanceof Error ? error.message : String(error));
}
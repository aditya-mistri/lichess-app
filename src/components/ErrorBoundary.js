'use client';

import { useState, useEffect } from 'react';

export default function ErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      setHasError(true);
      setError(event.error);
    };

    const handleUnhandledRejection = (event) => {
      setHasError(true);
      setError(event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    if (fallback) {
      return fallback(error);
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => {
                setHasError(false);
                setError(null);
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
          </div>
          {error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error Details
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return children;
}

// Hook for handling async operations with error states
export function useAsyncError() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const executeAsync = async (asyncFunction) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { error, loading, executeAsync, clearError };
}

// Loading component
export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Error message component
export function ErrorMessage({ error, onRetry, className = '' }) {
  if (!error) return null;

  return (
    <div className={`p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-red-500 text-xl">⚠️</span>
        </div>
        <div className="ml-3 flex-1">
          <p className="font-semibold">Error:</p>
          <p className="mt-1">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
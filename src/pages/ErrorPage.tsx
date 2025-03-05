
import React from 'react';
import { Link, useNavigate, useRouteError } from 'react-router-dom';

interface ErrorResponse {
  status?: number;
  statusText?: string;
  message?: string;
}

const ErrorPage: React.FC = () => {
  const error = useRouteError() as ErrorResponse;
  const navigate = useNavigate();
  
  const errorStatus = error?.status || 404;
  const errorMessage = error?.message || 'Sorry, we couldn\'t find the page you\'re looking for.';
  
  const getErrorTitle = () => {
    switch (errorStatus) {
      case 404:
        return 'Page not found';
      case 403:
        return 'Access forbidden';
      case 500:
        return 'Server error';
      default:
        return 'Something went wrong';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white pt-16 pb-12">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
        <div className="flex flex-shrink-0 justify-center">
          <a href="/" className="inline-flex">
            <span className="sr-only">Your Company</span>
            <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </a>
        </div>
        <div className="py-16">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-600">{errorStatus}</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {getErrorTitle()}
            </h1>
            <p className="mt-2 text-base text-gray-500">{errorMessage}</p>
            <div className="mt-6 flex items-center justify-center gap-x-6">
              <button
                onClick={() => navigate(-1)}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go back
              </button>
              <Link to="/" className="text-sm font-semibold text-gray-900">
                Go home <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="mx-auto w-full max-w-7xl flex-shrink-0 px-6 lg:px-8">
        <nav className="flex justify-center space-x-4">
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Contact Support
          </a>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Status
          </a>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Help
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default ErrorPage;

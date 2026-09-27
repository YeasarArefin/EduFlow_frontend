import type { NextConfig } from 'next';

const backendApiBaseUrl = process.env.BACKEND_API_BASE_URL?.replace(/\/$/, '');
const backendOrigin = backendApiBaseUrl?.replace(/\/api\/v1$/, '');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard/student',
        destination: '/workspace/students',
        permanent: true,
      },
      {
        source: '/dashboard/batch',
        destination: '/workspace/batches',
        permanent: true,
      },
      {
        source: '/dashboard/teacher',
        destination: '/workspace/teachers',
        permanent: true,
      },
      {
        source: '/dashboard/fee',
        destination: '/workspace/fees',
        permanent: true,
      },
      {
        source: '/dashboard/payments',
        destination: '/workspace/fees',
        permanent: true,
      },
      {
        source: '/dashboard/students/:path*',
        destination: '/workspace/students/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/teachers/:path*',
        destination: '/workspace/teachers/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/batches/:path*',
        destination: '/workspace/batches/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/notices/:path*',
        destination: '/workspace/notices/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/communication/:path*',
        destination: '/workspace/communication/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/attendance/:path*',
        destination: '/workspace/attendance/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/fees/:path*',
        destination: '/workspace/fees/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/salaries/:path*',
        destination: '/workspace/salaries/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/expenses/:path*',
        destination: '/workspace/expenses/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/staff/:path*',
        destination: '/workspace/staff/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/settings/:path*',
        destination: '/workspace/settings/:path*',
        permanent: true,
      },
      { source: '/dashboard/finance', destination: '/workspace/dashboard', permanent: true },
      { source: '/dashboard', destination: '/workspace/dashboard', permanent: true },
      { source: '/workspace', destination: '/workspace/dashboard', permanent: true },
    ];
  },
  async rewrites() {
    return [
      ...(backendApiBaseUrl && backendOrigin
        ? [
            { source: '/api/auth/:path*', destination: `${backendOrigin}/api/auth/:path*` },
            { source: '/api/v1/:path*', destination: `${backendApiBaseUrl}/:path*` },
          ]
        : []),
      { source: '/workspace/dashboard', destination: '/dashboard' },
      { source: '/workspace/:path*', destination: '/dashboard/:path*' },
    ];
  },
};

export default nextConfig;

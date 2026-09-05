import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/student",
        destination: "/dashboard/students",
        permanent: true,
      },
      {
        source: "/dashboard/batch",
        destination: "/dashboard/batches",
        permanent: true,
      },
      {
        source: "/dashboard/teacher",
        destination: "/dashboard/teachers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

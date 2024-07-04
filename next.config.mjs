// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

// above was original

//

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      layers: true,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }

    return config;
  },
  future: {
    webpack5: true,
  },
};

export default nextConfig;

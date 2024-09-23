/** @type {import('next').NextConfig} */

import path from 'path';
import * as fs from 'fs';
import { globSync } from 'glob';

const __dirname = path.resolve();

const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(process.cwd());
    config.externals.push({
      'node:crypto': 'commonjs crypto',
    });
    if (isServer) {
      const zipSourcePath = path.join(__dirname, 'data/zips/US.txt');
      const zipDestinationPath = path.join(__dirname, '.next', 'US.txt');
      fs.copyFileSync(zipSourcePath, zipDestinationPath);
      console.log(process.env);
      console.log('MOCK_API', process.env.MOCK_API);
      if (process.env.MOCK_API == 'true') {
        const pattern = 'data/mockdata/**/*.json';
        console.log({ pattern });
        globSync(pattern, {
          maxDepth: 10,
        }).forEach((file) => {
          console.log('Copying file: ', file);
          const destination = path.join('.next', file.replace(path.join('data', 'mockdata'), 'mockdata'));
          if (!fs.existsSync(path.dirname(destination))) {
            fs.mkdirSync(path.dirname(destination), { recursive: true });
          }
          fs.copyFileSync(file, destination);
        });
      }
    }
    return config;
  },
  transpilePackages: ['lucide-react'],
};

export default nextConfig;
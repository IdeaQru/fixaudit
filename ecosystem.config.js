module.exports = {
  apps: [
    {
      name: 'my-app',
      script: './dist/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3627
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3627
      }
    }
  ]
};

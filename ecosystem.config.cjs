const dotenv = require("dotenv");
const envConfig = dotenv.config({ path: ".env.production" });
const envVars = envConfig.parsed || {};

module.exports = {
  apps: [
    {
      name: "alsaedy-frontend",
      script: "./server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 5174,
        // Merge environment variables from .env.production
        ...envVars,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
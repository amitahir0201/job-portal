module.exports = {
  apps: [
    {
      name: "jobhubnow-backend",
      cwd: "/var/www/jobhubnow/Backend/src",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    },
    {
      name: "jobhubnow-frontend",
      cwd: "/var/www/jobhubnow/frontend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
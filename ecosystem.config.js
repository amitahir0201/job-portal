module.exports = {
  apps: [
    {
      name: "jobhubnow-backend",
      script: "./Backend/src/server.js",
      cwd: "/var/www/jobhubnow",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "jobhubnow-frontend",
      script: "npm",
      args: "run preview",
      cwd: "/var/www/jobhubnow/frontend",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
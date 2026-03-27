module.exports = {
  apps: [
    {
      name: "jobhubnow-backend",
      script: "server.js",               // Just the filename
      cwd: "/var/www/jobhubnow/Backend/src", // Run it directly from the src folder
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "jobhubnow-frontend",
      script: "npm",
      args: "run preview -- --port 3000 --host 0.0.0.0",
      cwd: "/var/www/jobhubnow/frontend",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};

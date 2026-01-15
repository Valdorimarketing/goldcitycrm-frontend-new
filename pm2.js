module.exports = {
  apps: [
    // Production
    {
      name: "crm-frontend-tr1",
      script: "npm",
      args: "start",
      cwd: "./",
      env: {
        NODE_ENV: "production",
        NITRO_PORT: "3002",
      }
    },
    
    // Development
    {
      name: "crm-frontend-tr1-dev",
      script: "npm",
      args: "run dev",
      cwd: "./",
      watch: true,
      ignore_watch: ["node_modules", ".nuxt", ".output", "logs"],
      env: {
        NODE_ENV: "development",
        NITRO_PORT: "3001",
        NUXT_PUBLIC_API_BASE_URL: "http://localhost:4001",
      }
    }
  ],
}
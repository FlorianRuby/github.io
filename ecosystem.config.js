module.exports = {
  apps: [{
    name: "portfolio",
    script: "server.js",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M'
  }]
}; 
{
  "functions": {
    "api/merge.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/merge.js" }
  ]
}

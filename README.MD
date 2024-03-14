# Node/TypeScript Application Demo

This project demonstrates a simple application built around the Precision Planting Panorama API using Node.js and TypeScript. It interfaces with the Parnoama API, and displays the fetched data on a web page using Handlebars as the templating engine and Bootstrap for styling. This serves as a foundational example for developers looking to interface with the API themselves.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your system. You can check their presence by running:

```bash
node --version
npm --version
```

If these commands return versions, you're ready to go. If not, [download and install Node.js and npm](https://nodejs.org/) from the official website.

# Installation

- Clone the repository:
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name 
```

- Install the dependencies:
```bash
npm install
```

- Compile TypeScript to Javascript:
```bash
npm run build 
```

- Start the application:
```bash
npm start
```

Your server should now be running on http://localhost:3000.

# Development

For development purposes, you might want to watch for changes in your TypeScript files and automatically recompile:

```bash
npm run dev
```

This command utilizes `concurrently` and `nodemon` to watch your files and restart the server upon changes.


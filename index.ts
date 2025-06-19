import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { JSONRPCError } from "@modelcontextprotocol/sdk/types.js";
import { getServer } from "./src/mcp-server.js";

const app = express();
app.use(express.json());

// Handle POST requests for client-to-server communication
app.post('/mcp', async (req, res) => {
  console.log('POST /mcp request received:', {
    bodyType: typeof req.body,
    body: JSON.stringify(req.body, null, 2),
    headers: req.headers,
    rawBody: req.body
  });

  // Log the raw request before MCP processing
  console.log('Raw request body:', req.body);
  console.log('Request headers:', req.headers);

  // In stateless mode, create a new instance of transport and server for each request
  // to ensure complete isolation. A single instance would cause request ID collisions
  // when multiple clients connect concurrently.
  
  try {
    const server = getServer(); 
    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    
    res.on('close', () => {
      console.log('Request closed');
      transport.close();
      server.close();
    });
    
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: '',
      } satisfies JSONRPCError);
    }
  }
});

app.get('/mcp', async (req, res) => {
  // console.log('Received GET MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: ''
  }));
});

app.delete('/mcp', async (req, res) => {
  // console.log('Received DELETE MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: ''
  }));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  // console.log(`A Pattern Language MCP Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  // console.log('\nReceived SIGINT. Shutting down gracefully...');
  server.close(() => {
    // console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  // console.log('\nReceived SIGTERM. Shutting down gracefully...');
  server.close(() => {
    // console.log('Server closed');
    process.exit(0);
  });
});

export { app, server };

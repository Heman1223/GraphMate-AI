import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import env from './config/env';
import connectDB from './config/db';
import { errorHandler, notFound } from './middleware/error.middleware';

// Route imports
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import friendRoutes from './routes/friend.routes';
import recommendationRoutes from './routes/recommendation.routes';
import graphRoutes from './routes/graph.routes';
import searchRoutes from './routes/search.routes';
import notificationRoutes from './routes/notification.routes';
import analyticsRoutes from './routes/analytics.routes';
import chatRoutes from './routes/chat.routes';
import communityRoutes from './routes/community.routes';

const app = express();
const httpServer = http.createServer(app);

// ─── Socket.IO ───────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('User connected to Socket.IO', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('send_message', (data) => {
    socket.to(data.roomId).emit('receive_message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('typing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});


// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsers ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static Files ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'GraphMate API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/graph', graphRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/communities', communityRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    httpServer.listen(env.PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 GraphMate API Server (with WebSockets)           ║
║                                                       ║
║   Port:        ${String(env.PORT).padEnd(39)}║
║   Environment: ${env.NODE_ENV.padEnd(39)}║
║   MongoDB:     ${env.MONGODB_URI.substring(0, 39).padEnd(39)}║
║   AI Service:  ${env.AI_SERVICE_URL.padEnd(39)}║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('💀 Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

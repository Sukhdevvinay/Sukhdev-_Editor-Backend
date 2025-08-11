const express = require('express');
const connectmongodb = require("./Database");
const http = require("http");
const { Server } = require("socket.io");
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

connectmongodb();

const app = express();

// ✅ CORS for frontend
app.use(cors({
  origin: "https://sukhdev-editor.vercel.app", // no trailing slash
  credentials: true
}));

// ✅ Allow preflight requests for all routes
app.options('*', cors({
  origin: "https://sukhdev-editor.vercel.app",
  credentials: true
}));

const server = http.createServer(app);

// ✅ Socket.IO CORS
const io = new Server(server, {
  cors: {
    origin: "https://sukhdev-editor.vercel.app", // no trailing slash
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ===== SOCKET.IO EVENTS =====
let users = {};
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("Connected_to_user",(user_name)=> {
    console.log("User : ",user_name," is connected");
  });

  socket.on("Send_text_data",(data)=> {
    console.log("Data sent :",data);
    socket.broadcast.emit("Write_text_data",data);
  });

  socket.on("Send_Draw_data",(data)=> {
    console.log("Draw data sent : ",data);
    socket.broadcast.emit("Write_Draw_data",data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ===== ROUTES =====
const login = require('./Routes/login');
const Signup = require('./Routes/signup');
const save_text = require('./Routes/save_text');
const save_draw = require('./Routes/save_draw');
const log_out = require('./Routes/logout');
const send_details = require('./Routes/send_details');

app.use('/login', login);
app.use('/Signup', Signup);
app.use('/editor', save_text);
app.use('/Draw', save_draw);
app.use('/logout', log_out);
app.use('/editor', send_details);
app.use('/Draw', send_details);

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 App is listening on port ${PORT}`);
});

const express = require('express');
const connectmongodb = require("./Database");
const http = require("http");
// const { Server } = require("socket.io");
const {Server: SocketServer} = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

connectmongodb();
dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Very permissive CORS for both HTTP & WS
// app.use(cors({
//   origin: "https://sukhdev-editor.vercel.app", // exact frontend origin
//   // credentials: true
// }));
app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://sukhdev-editor.vercel.app');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   // console.log("✅ CORS headers set for:", req.originalUrl);
//   next();
// });

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// // ✅ Allow preflight requests for all routes
// app.options('*', cors({
//   origin: "https://sukhdev-editor.vercel.app",
//   credentials: true
// }));

// const server = http.createServer(app);

// ✅ Socket.IO CORS
// const io = new Server(server, {
//   cors: {
//     origin: "https://sukhdev-editor.vercel.app", // exact frontend origin
//     methods: ["GET", "POST"],
//     // credentials: true
//   }
// });
const io = new SocketServer({
    cors: '*',
    maxHttpBufferSize: 1e8
})

io.attach(server);


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







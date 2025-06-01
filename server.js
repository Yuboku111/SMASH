const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const srv = http.createServer(app);
const io = new Server(srv, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// プロセスエラーハンドリング
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

// 静的ファイルを配信（public/フォルダから）
app.use(express.static('public'));

// ルートパスのリダイレクト
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'game.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error loading game');
        }
    });
});

// ヘルスチェック用エンドポイント
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK',
        message: 'SMASH Online Game Server is running',
        timestamp: new Date().toISOString(),
        rooms: rooms.size
    });
});

// ゲームルーム管理
const rooms = new Map();

io.on('connection', (socket) => {
    console.log('プレイヤーが接続しました:', socket.id);

    // ルームに参加
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                players: [],
                gameState: 'waiting'
            });
        }
        
        const room = rooms.get(roomId);
        
        // プレイヤーを追加（最大2人）
        if (room.players.length < 2) {
            const playerNumber = room.players.length + 1;
            const player = {
                id: socket.id,
                playerNumber: playerNumber,
                name: `プレイヤー ${playerNumber}`
            };
            
            room.players.push(player);
            socket.playerNumber = playerNumber;
            socket.roomId = roomId;
            
            console.log(`プレイヤー ${playerNumber} がルーム ${roomId} に参加`);
            
            // クライアントに参加情報を送信
            socket.emit('playerAssigned', { playerNumber, roomId });
            
            // ルーム内の全員に更新を通知
            io.to(roomId).emit('roomUpdate', {
                players: room.players,
                gameState: room.gameState
            });
            
            // 2人揃ったらゲーム開始
            if (room.players.length === 2) {
                room.gameState = 'playing';
                io.to(roomId).emit('gameStart');
                console.log(`ルーム ${roomId} でゲーム開始`);
            }
        } else {
            socket.emit('roomFull');
        }
    });

    // プレイヤーの状態更新
    socket.on('playerState', (data) => {
        if (socket.roomId) {
            // 他のプレイヤーに状態を送信
            socket.to(socket.roomId).emit('playerStateUpdate', {
                playerNumber: socket.playerNumber,
                state: data
            });
        }
    });

    // 攻撃イベント
    socket.on('attack', (data) => {
        if (socket.roomId) {
            socket.to(socket.roomId).emit('playerAttack', {
                playerNumber: socket.playerNumber,
                attackData: data
            });
        }
    });

    // 必殺技イベント
    socket.on('ultimate', (data) => {
        if (socket.roomId) {
            socket.to(socket.roomId).emit('playerUltimate', {
                playerNumber: socket.playerNumber,
                ultimateData: data
            });
        }
    });

    // ダメージイベント
    socket.on('damage', (data) => {
        if (socket.roomId) {
            socket.to(socket.roomId).emit('playerDamage', {
                playerNumber: socket.playerNumber,
                damageData: data
            });
        }
    });

    // 弾丸作成イベント
    socket.on('bulletCreate', (data) => {
        if (socket.roomId) {
            socket.to(socket.roomId).emit('bulletCreate', data);
        }
    });
    
    // 弾丸削除イベント
    socket.on('bulletDestroy', (data) => {
        if (socket.roomId) {
            socket.to(socket.roomId).emit('bulletDestroy', data);
        }
    });
    
    // 勝利イベント
    socket.on('victory', (data) => {
        if (socket.roomId) {
            const room = rooms.get(socket.roomId);
            if (room) {
                room.gameState = 'ended';
                io.to(socket.roomId).emit('gameEnd', {
                    winner: data.winner,
                    winnerNumber: socket.playerNumber
                });
            }
        }
    });

    // プレイヤー名更新
    socket.on('updatePlayerName', (name) => {
        if (socket.roomId) {
            const room = rooms.get(socket.roomId);
            if (room) {
                const player = room.players.find(p => p.id === socket.id);
                if (player) {
                    player.name = name;
                    io.to(socket.roomId).emit('roomUpdate', {
                        players: room.players,
                        gameState: room.gameState
                    });
                }
            }
        }
    });

    // 切断処理
    socket.on('disconnect', () => {
        console.log('プレイヤーが切断しました:', socket.id);
        
        if (socket.roomId) {
            const room = rooms.get(socket.roomId);
            if (room) {
                // プレイヤーをルームから削除
                room.players = room.players.filter(p => p.id !== socket.id);
                
                if (room.players.length === 0) {
                    // ルームが空になったら削除
                    rooms.delete(socket.roomId);
                    console.log(`ルーム ${socket.roomId} を削除`);
                } else {
                    // 残りのプレイヤーに通知
                    room.gameState = 'waiting';
                    io.to(socket.roomId).emit('playerDisconnected', socket.playerNumber);
                    io.to(socket.roomId).emit('roomUpdate', {
                        players: room.players,
                        gameState: room.gameState
                    });
                }
            }
        }
    });
});

// エラーハンドリング
app.use((err, req, res, _next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// 404ハンドリング
app.use((req, res) => {
    console.log(`404 - Path not found: ${req.path}`);
    res.status(404).json({ 
        error: 'Path not found',
        path: req.path 
    });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

srv.listen(PORT, HOST, (err) => {
    if (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
    
    console.log(`🚀 SMASH Online Game Server started`);
    console.log(`📡 Server running on ${HOST}:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🎮 Room management system ready`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
    console.log(`🔗 Access at: http://${HOST}:${PORT}`);
});
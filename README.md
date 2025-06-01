# SMASH - オンライン3D格闘ゲーム

Socket.IOとThree.jsを使用したリアルタイムオンライン対戦格闘ゲームです。

## 機能

- **ローカル対戦**: 1つのPCで2人プレイ
- **オンライン対戦**: インターネット経由で2人対戦
- **3Dグラフィック**: Three.jsによる3D環境
- **多彩な攻撃**: 剣攻撃、銃攻撃、必殺技
- **エフェクト**: パーティクルエフェクトと効果音
- **カスタマイズ**: プレイヤー名・操作設定変更

## ファイル構成

```
SMASH/
├── server.js          # Socket.IOサーバー
├── package.json       # Node.js依存関係
├── README.md          # このファイル
└── public/
    ├── game.html      # メインゲームファイル
    ├── logo.png       # ゲームロゴ
    └── background.png # 背景画像
```

## ローカル実行手順

1. Node.jsをインストール (v18以上推奨)
2. 依存関係をインストール:
   ```bash
   npm install
   ```
3. サーバーを起動:
   ```bash
   npm start
   ```
4. ブラウザで `http://localhost:3000` にアクセス

## Render.comへのデプロイ手順

### 1. GitHubリポジトリの準備

```bash
cd SMASH
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
git push -u origin main
```

### 2. Render.comでのデプロイ

1. [Render.com](https://render.com) にサインアップ/ログイン
2. ダッシュボードで **「New → Web Service」** をクリック
3. GitHubリポジトリを選択
4. 以下の設定で作成:

| 項目 | 値 |
|------|-----|
| **Name** | smash-online-game |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

### 3. 動作確認

- Renderが提供するURL（例：`https://smash-online-game.onrender.com`）にアクセス
- 「オンライン対戦」ボタンでルーム作成/参加
- 別デバイス/ブラウザで同じルームに参加してテスト

## 使用技術

- **フロントエンド**: Three.js, Socket.IO Client, Web Audio API
- **バックエンド**: Node.js, Express, Socket.IO
- **デプロイ**: Render.com (無料プラン対応)

## ゲームの遊び方

### ローカル対戦
- 「ローカル対戦」ボタンで即座に2人対戦開始

### オンライン対戦
1. 「オンライン対戦」ボタンをクリック
2. 「新規ルーム作成」または「ルーム参加」を選択
3. ルームIDを共有して友達を招待
4. 2人揃ったら自動でゲーム開始

### 操作方法
**プレイヤー1**: A/D移動, W ジャンプ, F 攻撃, G 銃, S 防御, Q 必殺
**プレイヤー2**: ←/→移動, ↑ ジャンプ, L 攻撃, K 銃, ↓ 防御, J 必殺

## トラブルシューティング

### よくある問題

- **「真っ白画面」**: game.htmlが`public/`フォルダにあることを確認
- **「接続エラー」**: サーバーが起動していることを確認
- **「ルーム参加失敗」**: ルームIDが正確であることを確認

### ログの確認
- Render.com: Dashboard → Service → Logs
- ローカル: ターミナルでサーバーログを確認

## ライセンス

MIT License
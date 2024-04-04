# Online-Othello

このプロジェクトは、フロントエンドは client ディレクトリの [Next.js](https://nextjs.org/) 、バックエンドは server ディレクトリの [frourio](https://frourio.com/) で構築された TypeScript で一気通貫開発されたオンラインリアルタイムオセロです。認証機能は [Firebase Authentication](https://firebase.google.com/?hl=ja) を使用しています。データベースは [PostgreSQL](https://www.postgresql.org/) で、ORM は [Prisma](https://www.prisma.io/) です。[Docker](https://www.docker.com/) で開発環境を構築しています。

## デモ

フロントエンド、バックエンドともに[Render](https://render.com/)でデプロイしています。無料契約のため、アクセスが遅い可能性があります。
Online-Othello: [https://online-othello-client.onrender.com](https://online-othello-client.onrender.com)

## 機能

- ユーザー登録、ログイン、ログアウト
- リアルタイムオセロ対戦
- 複数の部屋

## 開発手順

### Node.js のインストール

ローカルマシンに直接インストールする

<https://nodejs.org/ja/> の左ボタン、LTS をダウンロードしてインストール

### リポジトリのクローンと npm モジュールのインストール

ルートとフロントとバックエンドそれぞれに package.json があるので 3 回インストールが必要

```sh
npm i
npm i --prefix client
npm i --prefix server
```

### 環境変数ファイルの作成

```sh
cp client/.env.example client/.env
cp server/.env.example server/.env
cp docker/dev/.env.example docker/dev/.env
```

### ミドルウェアのセットアップ

```sh
docker compose up -d
```

### 開発サーバー起動

次回以降は以下のコマンドだけで開発できる

```sh
npm run notios
```

Web ブラウザで <http://localhost:3000> を開く

開発時のターミナル表示は [notios](https://github.com/frouriojs/notios) で制御している

[Node.js モノレポ開発のターミナルログ混雑解消のための新作 CLI ツール notios](https://zenn.dev/luma/articles/nodejs-new-cli-tool-notios)

閉じるときは `Ctrl + C` を 2 回連続で入力

#### Firebase Emulator

<http://localhost:4000/auth>

#### MinIO Console

<http://localhost:9001/>

#### PostgreSQL UI

```sh
cd server
npx prisma studio
```

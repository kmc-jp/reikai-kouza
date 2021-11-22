# 例会講座

## ⚡ 概要

[議題/2021/例会・例会講座の見直し](https://inside.kmc.gr.jp/wiki/?%E8%AD%B0%E9%A1%8C%2F2021%2F%E4%BE%8B%E4%BC%9A%E3%83%BB%E4%BE%8B%E4%BC%9A%E8%AC%9B%E5%BA%A7%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97)

## 🔨 ビルド

yarn が必要です。

```
$ cd reikai-kouza
$ yarn install
$ yarn build              # dist/ 以下に生成
```

## 🎨 フォーマット

```
$ # ビルドの手順は済んでいるものとします
$ yarn fix
```

## 🐎 実行

事前に `secret/keys.json` を設定する。 `secret/keys.example.json` に設定例がある。

### additionalAssignTask.js

追加の割り当てを行う。

#### 実行例

```
$ node additionalAssignTask.js $(date +"%Y%m%d")
```

### assignTask.js

割り当てを行う。

#### 実行例

```
$ node assignTask.js $(date +"%Y%m%d")
```

### background.js

サーバー側の処理

#### 実行例

```
$ node background.js
```

### publicAnnounce.js

#### 実行例

```
$ node publicAnnounce.js $(date +"%Y%m%d")
```

### registerExistingMembers.js

- [x] テスト不可

#### 実行例

```
$ node registerExistingMembers.js $(date +"%Y%m%d")
```

### send2AllMembers.js

- [x] テスト不可

#### 実行例

```
$ node send2AllMembers.js
```

### updateMembers.js

#### 実行例

```
$ node updateMembers.js $(date +"%Y%m%d")
```

### updateStatus.js

#### 実行例

```
$ node updateStatus.js $(date +"%Y%m%d")
```

## ⏳ 運用

### 稼働時に一度だけ実行

- registerExistingMembers.js
- send2AllMembers.js

### 1日1回実行

- additionalAssignTask.js
- updateStatus.js
- assignTask.js
- publicAnnounce.js
- updateMembers.js

## 🚦 テスト

DBに手動追加した上で運用させる

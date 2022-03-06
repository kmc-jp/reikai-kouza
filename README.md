# 例会講座

[![Lint](https://github.com/kmc-jp/reikai-kouza/actions/workflows/main.yml/badge.svg)](https://github.com/kmc-jp/reikai-kouza/actions/workflows/main.yml)

## ⚡ 概要

[議題/2021/例会・例会講座の見直し](https://inside.kmc.gr.jp/wiki/?%E8%AD%B0%E9%A1%8C%2F2021%2F%E4%BE%8B%E4%BC%9A%E3%83%BB%E4%BE%8B%E4%BC%9A%E8%AC%9B%E5%BA%A7%E3%81%AE%E8%A6%8B%E7%9B%B4%E3%81%97)

## 🔨 ビルド

### docker を用いる場合

以下の通りに実行すれば、`./dist` 以下に生成されます。(`yarn build:production` を実行した場合と同様に生成されます。)

```
$ ./prepare.sh
$ ./production-build.sh
```

### docker を使用しない場合

yarn が必要です。Dockerを使用した場合と同様に、`./dist` 以下に生成されます。

```
$ cd reikai-kouza
$ yarn install
$ yarn prepare
$ yarn build              # または、yarn build:production
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

- [x] テスト不可

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

※ `assignTask.js` は、2回実行される

以下のようなシェルスクリプトを用意し、定期実行する。

```bash
#!/bin/bash

cd $(dirname $0)

/usr/local/bin/node ./additionalAssignTask.js $1
sleep 1m
/usr/local/bin/node ./updateStatus.js $1
sleep 1m
/usr/local/bin/node ./assignTask.js $1
sleep 1m
/usr/local/bin/node ./assignTask.js $1
sleep 1m
/usr/local/bin/node ./publicAnnounce.js $1
sleep 1m
/usr/local/bin/node ./updateMembers.js $1
```

## 🚦 テスト

DBに手動追加した上で運用させる

以下のファイルを1回ずつ順に引数を変えながら実行<br>

- additionalAssignTask.js
- updateStatus.js
- assignTask.js
- publicAnnounce.js

※ `assignTask.js` は、2回実行される

以下のようなシェルスクリプトを用意し、定期実行する。
稼働テストの詳細は、[稼働テストのログ](https://github.com/kmc-jp/reikai-kouza/wiki/%E7%A8%BC%E5%83%8D%E3%83%86%E3%82%B9%E3%83%88%E3%81%AE%E3%83%AD%E3%82%B0)にある。

```bash
#!/bin/bash

cd $(dirname $0)

/usr/local/bin/node ./additionalAssignTask.js $1
sleep 1m
/usr/local/bin/node ./updateStatus.js $1
sleep 1m
/usr/local/bin/node ./assignTask.js $1
sleep 1m
/usr/local/bin/node ./assignTask.js $1
sleep 1m
/usr/local/bin/node ./publicAnnounce.js $1
```

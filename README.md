# Phaser3用AdvancedTiming
- オリジナルはPhaser2版
  - https://github.com/samme/phaser-plugin-advanced-timing#readme
  - https://www.npmjs.com/package/phaser-plugin-advanced-timing
- このプロジェクトの雛形
  - [Phaser 3 Webpack Project Template]()
- Phaser3用プラグインのテンプレート
  - https://github.com/photonstorm/phaser3-plugin-template
- クラスドキュメント
  - http://localhost:3000/list_class.html

```
cd ~/documents/github/phaser3-docs
php -S 0.0.0.0:3000
```

以上設定してから、`http://localhost:3000/docs/list_class.html`

# 使い方
- `build/AdvancedTiming.js`か、同パスの`min.js`をアプリのJavaScriptから読める場所におく
- `preload`で以下を呼ぶ

```js
this.load.plugin('AdvancedTiming', 'build/AdvancedTiming.js');
```

- `create`で以下を呼ぶ

```js
this.sys.install('AdvancedTiming');
```

- メソッドを呼び出す

```js
window.AdvancedTiming.prototype.test("me");
```

### Requirements

We need [Node.js](https://nodejs.org) to install and run scripts.

## Install and run

Run next commands in your terminal:

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies and launch browser with examples.|
| `npm start` | Launch browser to show the examples. <br> Press `Ctrl + c` to kill **http-server** process. |
=======

import 'phaser';

var config = {
    type: RENDER_TYPE,
    parent: 'phaser-example',
    width: 800,
    height: 480,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var SECOND = 1000;

/** emitterに関するパラメーター*/
var emitterGui = function(emitter, gui) {
  gui.add(emitter, "_flowQuantity", 0, 100, 5);
  gui.add(emitter, "frequency", 0, 1 * SECOND, 50);
  gui.add(emitter, "_lifespan", 0, 10 * SECOND, 100);
  gui.add(emitter, "maxParticles");

  gui.add(emitter, "on");
  return gui;
};

var RENDER_TYPE_NAME = ['AUTO', 'CANVAS', 'WEBGL'];
function debugTexts(delta) {
    var mes = "";
    mes += "["+RENDER_TYPE_NAME[this.sys.game.config.renderType]+"]\n";
    mes += "FPS:     "+Math.trunc(1000/delta)+"\n";
    mes += "BUNNIES: "+this.emitter.getAliveParticleCount()+"\n";
    this.myDebug.setText( mes );
}

function preload ()
{
    this.load.plugin('AdvancedTiming', 'build/AdvancedTiming.js');

    //this.load.baseURL = "https://examples.phaser.io/assets/";
    this.load.crossOrigin = "anonymous";
    this.load.image("bunny", "https://examples.phaser.io/assets/sprites/wabbit.png");
    this.load.image("sky", "https://examples.phaser.io/assets/skies/cavern2.png");
}

function create ()
{
    var BUNNY_COUNT = 1e4;
    var BUNNY_LIFESPAN = 3000;
    var BUNNY_INTERVAL = 100;
    var BUNNIES_PER_EMIT = 10;
    var BUNNY_GRAVITY = 200;
    var BUNNY_SPEED = {min: -100, max:100};

    this.sys.install('AdvancedTiming');

    // 初期化。引数はAdvancedTiming.MODE_???で定義
    this.sys.advancedTiming.init();

    console.log("create");

    var pluginGuiFolder, sky, world;
    //world = this.world;
    sky = this.add.image(config.width/2, config.height/2, "sky");
    sky.width = config.width;
    sky.height = config.height;

    // tweenで出現ポイントを往復させる
    var bunny = this.add.image(0, config.height/4,'bunny');
    var timeline = this.tweens.timeline(
        {
            targets: bunny,
            loop: -1,

            tweens: [
                {
                    x: config.width/2,
                    ease: 'Quad.easeIn',
                    duration: 1000
                },
                {
                    x: config.width,
                    ease: 'Quad.easeOut',
                    duration: 1000
                },
                {
                    x: config.width/2,
                    ease: 'Quad.easeIn',
                    duration: 1000
                },
                {
                    x: 0,
                    ease: 'Quad.easeOut',
                    duration: 1000
                }
            ]
        }
    );

    // パーティクルを生成
    var particle = this.add.particles('bunny');
    var emitter = this.emitter = particle.createEmitter({
        follow: bunny,
        maxParticles: BUNNY_COUNT,
        lifespan: BUNNY_LIFESPAN,
        frequency: BUNNY_INTERVAL,
        quantity: BUNNIES_PER_EMIT,
        gravityY: BUNNY_GRAVITY,
        speed: BUNNY_SPEED,
        bounce: 1,
        bounds: {x: 0, y: 0, width: config.width, height: config.height},
    });
    // パラメーターを設定
    emitter._flowQuantity = emitter.quantity.propertyValue;
    emitter._lifespan = emitter.lifespan.propertyValue;

    // GUI作成
    this.gui = new dat.GUI({
      width: 320
    });
    emitterGui(emitter, this.gui.addFolder("bunnies"));

    // デバッグ表示の作成
    this.myDebug = this.add.text(0, 0, "debug text", { color: '#00ff00', align: 'left' });
    this.debugTexts = debugTexts.bind(this);

/*

    gameGui(this.game, this.gui.addFolder("game"));
    gameScaleGui(this.game.scale, this.gui.addFolder("game.scale"));
    gameTimeGui(this.game.time, this.gui.addFolder("game.time"));
    pluginGui(this.game.timing, pluginGuiFolder = this.gui.addFolder("plugin"));
    pluginGuiFolder.open();
    debugSettingsGui(debugSettings, this.gui.addFolder("debug"));
    */
}

function update(time, delta) {
    this.emitter.setQuantity(this.emitter._flowQuantity);
    this.emitter.setLifespan(this.emitter._lifespan);

    // デバッグ出力
    this.debugTexts(delta);
}

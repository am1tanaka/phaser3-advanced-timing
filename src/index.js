import 'phaser';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 480,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

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

    var emitter, pluginGuiFolder, sky, world;
    //world = this.world;
    sky = this.add.image(config.width/2, config.height/2, "sky");
    sky.width = config.width;
    sky.height = config.height;

    // tweenで出現ポイントを往復させる
    var bunny = this.add.image(0, config.height/3,'bunny');
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
    var emitter = particle.createEmitter({
        follow: bunny,
        maxParticles: BUNNY_COUNT,
        lifespan: BUNNY_LIFESPAN,
        frequency: BUNNY_INTERVAL,
        quantity: BUNNIES_PER_EMIT,
        gravityY: BUNNY_GRAVITY,
        speed: BUNNY_SPEED
    });


/*
    this.gui = new dat.GUI({
      width: 320
    });

    emitterGui(emitter, this.gui.addFolder("bunnies"));
    gameGui(this.game, this.gui.addFolder("game"));
    gameScaleGui(this.game.scale, this.gui.addFolder("game.scale"));
    gameTimeGui(this.game.time, this.gui.addFolder("game.time"));
    pluginGui(this.game.timing, pluginGuiFolder = this.gui.addFolder("plugin"));
    pluginGuiFolder.open();
    debugSettingsGui(debugSettings, this.gui.addFolder("debug"));
    */
}

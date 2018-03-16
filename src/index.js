import 'phaser';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.plugin('AdvancedTiming', 'build/AdvancedTiming.js');
    this.load.image('logo', 'assets/logo.png');
}

function create ()
{
    this.sys.install('AdvancedTiming');
    window.AdvancedTiming.prototype.test("me");

    var logo = this.add.image(400, 150, 'logo');

    this.tweens.add({
        targets: logo,
        y: 450,
        duration: 2000,
        ease: 'Power2',
        yoyo: true,
        loop: -1
    });

}

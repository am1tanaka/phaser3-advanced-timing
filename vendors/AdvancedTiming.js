/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
 */

var AdvancedTiming = function(scene) {
    AdvancedTiming.renderTypes = [null, "Canvas", "WebGL", "Headless"];

    AdvancedTiming.MODE_GRAPH = "graph";

    AdvancedTiming.MODE_METER = "meter";

    AdvancedTiming.MODE_TEXT = "text";

    AdvancedTiming.MODE_DOM_METER = "domMeter";

    AdvancedTiming.MODE_DOM_TEXT = "domText";

    AdvancedTiming.MODE_DEFAULT = AdvancedTiming.MODE_TEXT;

    //  The Scene that owns this plugin
    this.scene = scene;

    this.systems = scene.sys;

    if (!scene.sys.settings.isBooted) {
        scene.sys.events.once('boot', this.boot, this);
    }
};

//  Static function called by the PluginFile Loader.
AdvancedTiming.register = function(PluginManager) {
    //  Register this plugin with the PluginManager, so it can be added to Scenes.

    //  The first argument is the name this plugin will be known as in the PluginManager. It should not conflict with already registered plugins.
    //  The second argument is a reference to the plugin object, which will be instantiated by the PluginManager when the Scene boots.
    //  The third argument is the local mapping. This will make the plugin available under `this.sys.base` and also `this.base` from a Scene if
    //  it has an entry in the InjectionMap.
    PluginManager.register('AdvancedTiming', AdvancedTiming, 'advancedTiming');
};

Object.defineProperty(AdvancedTiming.prototype, "mode", {
    get: function() {
        return this._mode;
    },
    set: function(val) {
        if (val === this._mode) {
            return this._mode;
        }
        switch (val) {
            case this.constructor.MODE_GRAPH:
            case this.constructor.MODE_METER:
            case this.constructor.MODE_TEXT:
            case this.constructor.MODE_DOM_TEXT:
            case this.constructor.MODE_DOM_METER:
                this._mode = val;
                this.add();
                this.activeDisplay = this.display[this._mode];
                break;
            default:
                throw new Error("No such mode: '" + val + "'");
        }
        this.refresh();
        return this._mode;
    }
});

AdvancedTiming.prototype = {

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot: function() {
        var eventEmitter = this.systems.events;

        //  Listening to the following events is entirely optional, although we would recommend cleanly shutting down and destroying at least.
        //  If you don't need any of these events then remove the listeners and the relevant methods too.

        eventEmitter.on('start', this.start, this);

        eventEmitter.on('preupdate', this.preUpdate, this);
        eventEmitter.on('update', this.update, this);
        eventEmitter.on('postupdate', this.postUpdate, this);

        eventEmitter.on('pause', this.pause, this);
        eventEmitter.on('resume', this.resume, this);

        eventEmitter.on('sleep', this.sleep, this);
        eventEmitter.on('wake', this.wake, this);

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    init: function(options) {
        var game, mode;
        console.log("init");
        this.game = this.systems;       // this.gameが移行したのでthis.systemsを設定
        game = this.systems;
        game.time.advancedTiming = true;
        /*
                this._gameUpdateLogic = this.game.updateLogic.bind(this.game);
                this._gameUpdateRender = this.game.updateRender.bind(this.game);
                this.game.updateLogic = this.updateLogic.bind(this);
                this.game.updateRender = this.updateRender.bind(this);
        */
        this.group = game.add.group(); // game.make.group(null, "advancedTimingPlugin", true);
        this.position = new Phaser.Geom.Point;
        this.renderType = this.constructor.renderTypes[game.config.renderType];
        this.reset();
        /*
        game.debug.gameInfo = this.debugGameInfo.bind(this);
        game.debug.gameTimeInfo = this.debugGameTimeInfo.bind(this);
        */
        this.display = {};
        /*
        if (options) {
          mode = options.mode;
          delete options.mode;
          Phaser.Utils.extend(this, options);
        }
        */
        this.mode = mode || this.constructor.MODE_DEFAULT;
    },

    //  Called when a Scene is started by the SceneManager. The Scene is now active, visible and running.
    start: function() {
        console.log("AdvancedTiming start");
    },

    //  Called every Scene step - phase 1
    preUpdate: function(time, delta) {},

    //  Called every Scene step - phase 2
    update: function(time, delta) {
        this.group.visible = this.visible;
        if (this.visible) {
            if (this.graphGroup && this.graphGroup.visible) {
                this.updateGraph();
            }
            if (this.meters && this.meters.visible) {
                this.updateMeters();
            }
            if (this.text && this.text.visible) {
                this.updateText();
            }
            if (this.domMeter) {
                this.updateDomMeter();
            }
            if (this.domText) {
                this.updateDomText();
            }
        }
    },

    updateDomMeter: function() {
        this.domMeter.value = this.game.time.fps;
    },

    updateDomText: function() {
        var content;
        content = this.textContent();
        if (content !== this.lastTextContent) {
            this.domText.textContent = this.lastTextContent = content;
            this.domText.style.color = this.fpsColor();
        }
    },

    updateGraph: function() {
        var _spiraling, colors, elapsed, elapsedMS, forceSingleUpdate, fps, graph, graphX, height, ref1, ref2, updatesThisFrame;
        ref1 = this.game, forceSingleUpdate = ref1.forceSingleUpdate, _spiraling = ref1._spiraling, updatesThisFrame = ref1.updatesThisFrame;
        ref2 = this.game.time, elapsed = ref2.elapsed, elapsedMS = ref2.elapsedMS, fps = ref2.fps;
        graph = this.graph, graphX = this.graphX;
        colors = this.constructor.colors;
        height = graph.height;
        graph.dirty = true;
        graph.rect(graphX, 0, 1, height, "black");
        if (fps <= height) {
            graph.rect(graphX, height - fps, 1, 1, colors.BLUE);
        }
        if (this.showElapsed) {
            if (elapsed <= height) {
                graph.rect(graphX, height - elapsed, 1, 1, colors.GREEN);
            }
            if (elapsed !== elapsedMS && elapsed <= height) {
                graph.rect(graphX, height - elapsedMS, 1, 1, colors.YELLOW);
            }
            if (!forceSingleUpdate) {
                graph.rect(graphX, height - updatesThisFrame, 1, 1, colors.NAVY);
            }
        }
        if (this.showDurations) {
            graph.rect(graphX, height - ~~this.updateDuration, 1, 1, colors.ORANGE);
            graph.rect(graphX, height - ~~this.renderDuration, 1, 1, colors.PURPLE);
        }
        if (this.showSpiraling && _spiraling > 0) {
            graph.rect(graphX, height - _spiraling, 1, 1, colors.RED);
        }
        this.graphX += 1;
        this.graphX %= graph.width;
    },

    updateMeters: function() {
        var desiredFps, desiredMs, elapsed, elapsedMS, fps, ref1;
        ref1 = this.game.time, desiredFps = ref1.desiredFps, elapsed = ref1.elapsed, elapsedMS = ref1.elapsedMS, fps = ref1.fps;
        desiredMs = this.desiredMs();
        this.desiredFpsMeter.scale.x = desiredFps;
        this.fpsMeter.scale.x = fps;
        this.elapsedMeters.visible = this.showElapsed;
        if (this.showElapsed) {
            this.desiredMsMeter.scale.x = desiredMs;
            this.msMeter.scale.x = elapsedMS;
            this.elapsedMeter.scale.x = elapsed;
        }
        this.durationMeters.visible = this.showDurations;
        if (this.showDurations) {
            this.desiredDurMeter.scale.x = desiredMs;
            this.updateDurationMeter.scale.x = this.updateDuration;
            this.renderDurationMeter.scale.x = this.renderDuration;
            this.renderDurationMeter.x = this.updateDurationMeter.width;
        }
    },

    updateText: function() {
        this.text.text = this.textContent();
        this.text.style.fill = this.fpsColor();
    },

    //  Called every Scene step - phase 3
    postUpdate: function(time, delta) {},

    //  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
    pause: function() {},

    //  Called when a Scene is resumed from a paused state.
    resume: function() {},

    //  Called when a Scene is put to sleep. A sleeping scene doesn't update or render, but isn't destroyed or shutdown. preUpdate events still fire.
    sleep: function() {},

    //  Called when a Scene is woken from a sleeping state.
    wake: function() {},

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown: function() {},

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy: function() {
        this.shutdown();

        this.scene = undefined;
    },

    reset: function(fpsMin, fpsMax, msMin, msMax) {
      var time;
      if (fpsMin == null) {
        fpsMin = Infinity;
      }
      if (fpsMax == null) {
        fpsMax = 0;
      }
      if (msMin == null) {
        msMin = Infinity;
      }
      if (msMax == null) {
        msMax = 0;
      }
      time = this.game.time;
      time.fpsMin = fpsMin;
      time.fpsMax = fpsMax;
      time.msMin = msMin;
      time.msMax = msMax;
    }

};

AdvancedTiming.prototype.constructor = AdvancedTiming;

//  Make sure you export the plugin for webpack to expose

module.exports = AdvancedTiming;

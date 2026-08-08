/*:
 * @target MZ
 * @plugindesc Battle Tester v0.1
 * @author Kumo
 *
 * @help
 * F8/F12 Console
 *
 * BattleTester.run(1);
 *
 * BattleTester.run({
 *      troopId: 3,
 *      actorId: 1,
 *      level: 5
 * });
 */

(() => {

  class BattleTester {
    static ending = false;
    static isRunning = false;
    static speed = 20;
    static turn = 0;
    static repeatCount = 0;
    static repeatCurrent = 0;

    static results = [];
    static skillCount = {};

    static defaultConfig() {
      return {
        troopId: 2,
        actorId: 9,
        level: 1
      };
    }

    static repeat(count, config) {
      this.repeatCount = count;
      this.repeatCurrent = 0;
      this.results = [];
      this.skillCount = {};
      this.run(config);
    }

    static run(config) {
      if (this.isRunning) {
        console.warn("BattleTester is already running.");
        return;
      }

      this.ending = false;
      this.isRunning = true;

      if (typeof config === "number") {
        config = {
          troopId: config
        };
      }

      this.config = Object.assign(
        this.defaultConfig(),
        config
      );

      console.clear();
      console.log("========== Battle Tester ==========");

      this.initialize();
      this.startBattle();
    }

    static initialize() {
      this.turn = 0;

      const config = this.config;

      console.log("Initialize");

      const actor = $gameActors.actor(config.actorId);

      $gameParty._actors = [];
      $gameParty.addActor(config.actorId);
      actor.changeLevel(config.level, false);
      actor.recoverAll();
      actor.initEquips([
        30,   // 武器
        // 12,  // 盾
        // 8,   // 頭
        // 15,  // 身體
        // 20   // 飾品
      ]);

      // 建立敵群
      $gameTroop.setup(config.troopId);

      console.log(
        `${actor.name()} Lv.${actor.level}`
      );
    }

    static startBattle() {

      const config = this.config;

      console.log("Start Battle");

      BattleManager.setup(
        config.troopId,
        true,
        false
      );

      SceneManager.push(Scene_Battle);
    }

    static battleEnd(result) {

      // result = 0   Victory
      // result = 1   Escape
      // result = 2   Defeat

      const actor = $gameActors.actor(this.config.actorId);

      this.results.push({
        win: result === 0,
        turn: this.turn,
        hp: actor.hp,
        mp: actor.mp,
        level: actor.level,
        troopId: this.config.troopId,
      });

      this.reset();

      this.repeatCurrent++;

      if (this.repeatCurrent < this.repeatCount) {
        this.run(this.config);
        return;
      }

      console.log("Repeat Finished");

      this.summary();
      this.reset();
    }

    static reset() {
      this.turn = 0;
      this.isRunning = false;
    }

    static summary() {

      const results = this.results;
      const count = results.length;

      if (count === 0) {
        return;
      }

      const sum = results.reduce((a, b) => ({
        win: a.win + (b.win ? 1 : 0),
        turn: a.turn + b.turn,
        hp: a.hp + b.hp,
        mp: a.mp + b.mp
      }), {
        win: 0,
        turn: 0,
        hp: 0,
        mp: 0
      });

      console.table({
        Battles: count,
        WinRate: `${(sum.win / count * 100).toFixed(1)}%`,
        AvgTurn: (sum.turn / count).toFixed(2),
        AvgHP: (sum.hp / count).toFixed(2),
        AvgMP: (sum.mp / count).toFixed(2),
        ...this.skillCount,
      });
    }
  }

  window.BattleTester = BattleTester;

  const _endBattle = BattleManager.endBattle;

  BattleManager.endBattle = function (result) {

    _endBattle.call(this, result);

    BattleTester.battleEnd(result);

  };

  const _startTurn = BattleManager.startTurn;

  BattleManager.startTurn = function () {
    BattleTester.turn++;
    _startTurn.call(this);
  };

  const _updateMain = Scene_Battle.prototype.update;

  Scene_Battle.prototype.update = function () {
    if (BattleTester.isRunning) {
      for (let i = 0; i < BattleTester.speed; i++) {
        _updateMain.call(this);
      }
    } else {
      _updateMain.call(this);
    }
  };

  Window_BattleLog.prototype.messageSpeed = function () {
    return 0;
  };
  BattleManager.endBattle = function (result) {
    if (BattleTester.ending) {
      return;
    }
    BattleTester.ending = true;
    _endBattle.call(this, result);
    BattleTester.battleEnd(result);
  };
  Window_BattleLog.prototype.wait = function () { };
  Window_BattleLog.prototype.waitForEffect = function () { };
  Window_BattleLog.prototype.waitForMovement = function () { };
  AudioManager.stopBgm();
  AudioManager.stopBgs();
  AudioManager.stopMe();
  AudioManager.playStaticSe = function () { };
  AudioManager.playBgm = function () { };
  AudioManager.playBgs = function () { };
  AudioManager.playMe = function () { };
  AudioManager.playSe = function () { };
  BattleManager.displayStartMessages = function () { };
  BattleManager.displayVictoryMessage = function () { };
  BattleManager.displayDefeatMessage = function () { };
  BattleManager.displayEscapeSuccessMessage = function () { };
  BattleManager.displayEscapeFailureMessage = function () { };
  BattleManager.displayRewards = function () { };
  BattleManager.gainRewards = function () { };
  Sprite_Animation.prototype.setup = function () { };
  Sprite_Actor.prototype.stepForward = function () { };
  Sprite_Actor.prototype.stepBack = function () { };
  Sprite_Actor.prototype.retreat = function () { };
  Sprite_Battler.prototype.createDamageSprite = function () { };
  Sprite_Actor.prototype.setupWeaponAnimation = function () { };
  Spriteset_Base.prototype.createAnimation = function () { };

  const _makeActions = Game_Actor.prototype.makeActions;

  Game_Actor.prototype.makeActions = function () {
    Game_Battler.prototype.makeActions.call(this);

    this.addState(32);
    this.makeAutoBattleActions();
  };

  const _makeAutoBattleActions = Game_Actor.prototype.makeAutoBattleActions;

  Game_Actor.prototype.makeAutoBattleActions = function () {
    _makeAutoBattleActions.call(this);

    for (let i = 0; i < this.numActions(); i++) {
      const action = this.action(i);
      if (!action) continue;

      const skill = action.item();

      console.log(
        this.name(),
        skill.id,
        skill.name
      );

      const key = `${skill.id}_${skill.name}`;

      BattleTester.skillCount[key] ??= 0;
      BattleTester.skillCount[key]++;
    }
  };
})();

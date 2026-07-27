/*:
 * @target MZ
 * @plugindesc Better Auto Battle AI (Basic)
 * @author Kumo
 *
 * @help
 * Basic Auto Battle AI
 *
 * Priority:
 * 1. HP <= 30% -> Heal Skill -> Heal Item
 * 2. MP <= 25% -> Recover MP Skill -> Recover MP Item
 * 3. If important buff is missing -> Chance to use Buff
 * 4. Otherwise -> Best Attack Skill
 * 
 * Tag:
 * <HealAI>
 * <RecoverMpAI>
 * <BuffAI>
 * <AttackAI>
 */

(() => {
  const HEAL_HP_RATE = 0.40;
  const RECOVER_MP_RATE = 0.25;
  const BUFF_CHANCE = 0.30;
  const STOP_USE_RECOVER_MP_ITEM_FLAG = 28;
  const STOP_USE_HEAL_ITEM_FLAG = 29;

  //==================================================
  // Common
  //==================================================

  Game_Actor.prototype.selectSkillByTag = function (tagName) {

    let bestSkill = null;
    let bestValue = -Infinity;

    for (const skill of this.skills()) {

      if (!this.canUse(skill)) {
        continue;
      }

      if (!skill.meta[tagName]) {
        continue;
      }

      const action = new Game_Action(this);
      action.setSkill(skill.id);

      const value = action.evaluate();

      if (value > bestValue) {
        bestValue = value;
        bestSkill = skill;
      }
    }

    return bestSkill;
  };

  Game_Actor.prototype.tryUseSkillByTag = function (actionIndex, tagName) {

    const skill = this.selectSkillByTag(tagName);

    if (!skill) {
      return false;
    }

    this.action(actionIndex).setSkill(skill.id);
    return true;
  };

  //==================================================
  // Attack
  //==================================================

  Game_Actor.prototype.isAttackSkill = function (skill) {
    return !!skill.meta.AttackAI;
  };

  Game_Actor.prototype.makeBestAttackAction = function (actionIndex) {

    const action = this.action(actionIndex);

    let bestSkill = null;
    let bestValue = -Infinity;

    for (const skill of this.skills()) {

      // 技能不能使用
      if (!this.canUse(skill)) {
        continue;
      }

      // 只考慮攻擊技能
      if (!this.isAttackSkill(skill)) {
        continue;
      }

      // 評估技能價值
      const testAction = new Game_Action(this);
      testAction.setSkill(skill.id);

      const value = testAction.evaluate();

      if (value > bestValue) {
        bestValue = value;
        bestSkill = skill;
      }
    }

    // 有最佳技能就使用，否則普通攻擊
    if (bestSkill) {
      action.setSkill(bestSkill.id);
    } else {
      action.setAttack();
    }
  };

  //==================================================
  // Auto Battle
  //==================================================

  Game_Actor.prototype.makeAutoBattleActions = function () {

    const numActions = this.numActions();

    for (let i = 0; i < numActions; i++) {

      // HP過低
      if (this.hpRate() <= HEAL_HP_RATE) {

        if (this.tryUseSkillByTag(i, "HealAI")) {
          continue;
        }

        if (this.tryUseHealingItem(i)) {
          continue;
        }
      }

      // MP不足
      if (this.mpRate() <= RECOVER_MP_RATE) {

        if (this.tryUseSkillByTag(i, "RecoverMpAI")) {
          continue;
        }

        if (this.tryUseRecoverMpItem(i)) {
          continue;
        }
      }

      // Buff
      if (!this.hasImportantBuff()) {

        if (Math.random() < BUFF_CHANCE) {

          if (this.tryUseSkillByTag(i, "BuffAI")) {
            continue;
          }
        }
      }

      // 攻擊
      this.makeBestAttackAction(i);
    }

    this.setActionState("waiting");
  };

  //==================================================
  // Buff
  //==================================================

  Game_Actor.prototype.hasImportantBuff = function () {

    for (const skill of this.skills()) {

      // 只檢查 Buff 技能
      if (!skill.meta.BuffAI) {
        continue;
      }

      // 找技能效果
      for (const effect of skill.effects) {

        // Add State
        if (effect.code !== Game_Action.EFFECT_ADD_STATE) {
          continue;
        }

        // 已經有這個 Buff
        if (this.isStateAffected(effect.dataId)) {
          return true;
        }
      }
    }

    return false;
  };

  //==================================================
  // Item
  //==================================================

  Game_Actor.prototype.tryUseHealingItem = function (actionIndex) {
    if ($gameSwitches.value(STOP_USE_HEAL_ITEM_FLAG)) return;

    const action = this.action(actionIndex);

    let bestItem = null;
    let bestValue = -Infinity;

    const missingHp = this.mhp - this.hp;

    for (const item of $gameParty.items()) {

      // 不是一般道具
      if (!DataManager.isItem(item)) {
        continue;
      }

      // 0 Always
      // 1 Menu Only
      // 2 Battle Only
      // 3 Never
      if (item.occasion === 1 || item.occasion === 3) {
        continue;
      }

      // 沒有 HealAI Tag
      if (!item.meta.HealAI) {
        continue;
      }

      // 沒有數量
      if ($gameParty.numItems(item) <= 0) {
        continue;
      }

      // 使用者不能使用
      if (!this.canUse(item)) {
        continue;
      }

      // 評估恢復量
      let value = 0;

      for (const effect of item.effects) {

        if (effect.code !== Game_Action.EFFECT_RECOVER_HP) {
          continue;
        }

        const heal = effect.value2 + this.mhp * effect.value1;

        // 超過缺血量的部分不計分，避免浪費
        value += Math.min(heal, missingHp);
      }

      if (value > bestValue) {
        bestValue = value;
        bestItem = item;
      }
    }

    if (!bestItem) {
      return false;
    }

    action.setItem(bestItem.id);
    // 指定目標為自己
    if (action.isForFriend() && action.isForOne()) {
      action.setTarget(this.index());
    }
    return true;
  };

  Game_Actor.prototype.tryUseRecoverMpItem = function (actionIndex) {
    if ($gameSwitches.value(STOP_USE_RECOVER_MP_ITEM_FLAG)) return;

    const action = this.action(actionIndex);

    let bestItem = null;
    let bestValue = -Infinity;

    const missingMp = this.mmp - this.mp;

    for (const item of $gameParty.items()) {

      // 不是一般道具
      if (!DataManager.isItem(item)) {
        continue;
      }

      // 0 Always
      // 1 Menu Only
      // 2 Battle Only
      // 3 Never
      if (item.occasion === 1 || item.occasion === 3) {
        continue;
      }

      // 沒有 RecoverMpAI Tag
      if (!item.meta.RecoverMpAI) {
        continue;
      }

      // 沒有數量
      if ($gameParty.numItems(item) <= 0) {
        continue;
      }

      // 使用者不能使用
      if (!this.canUse(item)) {
        continue;
      }

      // 評估恢復量
      let value = 0;

      for (const effect of item.effects) {

        if (effect.code !== Game_Action.EFFECT_RECOVER_MP) {
          continue;
        }

        const recover = effect.value2 + this.mmp * effect.value1;

        // 超過缺魔量的部分不計分，避免浪費
        value += Math.min(recover, missingMp);
      }

      if (value > bestValue) {
        bestValue = value;
        bestItem = item;
      }
    }

    if (!bestItem) {
      return false;
    }

    action.setItem(bestItem.id);
    return true;
  };

})()

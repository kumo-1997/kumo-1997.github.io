/*:
 * @target MZ
 * @plugindesc Check actors special equips
 * @author Kumo
 *
 * @help
 * 檢查特定人物的裝備是否被替換
 */

(() => {
  // =============
  // utils
  // =============

  /**
   * 
   * @param {{ actor: any, actorFlagId: number, commonEventId: number }} actorMetaData
   * @param {Array<{ equipId: number, switchId: number, equipType: "weapon" | "armor" }>} specialEquips 
   */
  function check_special_equips({ actor, actorFlagId, commonEventId }, specialEquips) {
    // 觸發過劇情就略過
    if ($gameSwitches.value(actorFlagId)) return;

    let equip_changed = false;
    const weapens = actor.weapons();
    const armors = actor.armors();

    // reset switch
    specialEquips.forEach(({ switchId }) => $gameSwitches.setValue(switchId, false));

    specialEquips.forEach(({ equipId, switchId, equipType }) => {
      const equips = equipType === "weapon"
        ? weapens
        : armors;

      const isEquipped = equips.some(e => e && e.id === equipId);

      if (!isEquipped) {
        $gameSwitches.setValue(switchId, true);
        equip_changed = true;
      }
    });


    // 觸發劇情
    if (equip_changed) {
      $gameSwitches.setValue(actorFlagId, true);
      $gameTemp.reserveCommonEvent(commonEventId);
    }
  }

  function check_actor_13_equips() {
    // switchId 都是共用開關，會在 check_special_equips 內被 reset
    const actor_13_special_equips = [
      { equipId: 122, switchId: 34, equipType: "armor" }, // 嗷嗷的髮圈
      { equipId: 124, switchId: 35, equipType: "armor" }, // 狐狸御守
    ];

    const actor_13 = $gameActors.actor(13); // 嗷嗷
    const actor_13_flag_id = 185;
    const actor_13_common_event_id = 23;

    check_special_equips(
      { actor: actor_13, actorFlagId: actor_13_flag_id, commonEventId: actor_13_common_event_id },
      actor_13_special_equips
    );
  }

  function check_actor_11_equips() {
    // switchId 都是共用開關，會在 check_special_equips 內被 reset
    const actor_11_special_equips = [
      { equipId: 72, switchId: 34, equipType: "weapon" }, // 教學弓
    ];

    const actor_11 = $gameActors.actor(11); // 馬修
    const actor_11_flag_id = 187;
    const actor_11_common_event_id = 25;

    check_special_equips(
      { actor: actor_11, actorFlagId: actor_11_flag_id, commonEventId: actor_11_common_event_id },
      actor_11_special_equips
    );
  }

  function check_actor_8_equips() {
    // switchId 都是共用開關，會在 check_special_equips 內被 reset
    const actor_8_special_equips = [
      { equipId: 143, switchId: 34, equipType: "armor" }, // 羅莎的無色墨鏡
    ];

    const actor_8 = $gameActors.actor(8); // 羅莎
    const actor_8_flag_id = 188;
    const actor_8_common_event_id = 26;

    check_special_equips(
      { actor: actor_8, actorFlagId: actor_8_flag_id, commonEventId: actor_8_common_event_id },
      actor_8_special_equips
    );
  }

  function check_actor_2_equips() {
    // switchId 都是共用開關，會在 check_special_equips 內被 reset
    const actor_2_special_equips = [
      { equipId: 129, switchId: 34, equipType: "armor" }, // 艾蓮的髮圈
    ];

    const actor_2 = $gameActors.actor(2); // 愛蓮
    const actor_2_flag_id = 186;
    const actor_2_common_event_id = 24;

    check_special_equips(
      { actor: actor_2, actorFlagId: actor_2_flag_id, commonEventId: actor_2_common_event_id },
      actor_2_special_equips
    );
  }

  // =============
  // main
  // =============
  let needCheckActor13 = false;
  let needCheckActor11 = false;
  let needCheckActor8 = false;
  let needCheckActor2 = false;

  // 有鎖定裝備的情況下選擇，取下全部裝備，會打多次 changeEquip 導致只會檢查到第一個特殊裝備的 flag
  // 解法就是讓他延遲到下一個 frame 去做一次性檢查
  const _changeEquip = Game_Actor.prototype.changeEquip;
  Game_Actor.prototype.changeEquip = function changeEquip(slotId, item) {
    _changeEquip.call(this, slotId, item);

    const actorId = this.actorId();

    switch (actorId) {
      case 13:
        needCheckActor13 = true;
        break;

      case 11:
        needCheckActor11 = true;
        break;

      case 8:
        needCheckActor8 = true;
        break;

      case 2:
        needCheckActor2 = true;
        break;
      default:
        break;
    }
  }

  const _clearEquipments = Game_Actor.prototype.clearEquipments;
  Game_Actor.prototype.clearEquipments = function clearEquipments() {
    _clearEquipments.call(this);

    const actorId = this.actorId();

    switch (actorId) {
      case 13:
        check_actor_13_equips();
        break;
      case 11:
        check_actor_11_equips();
        break;

      case 8:
        check_actor_8_equips();
        break;

      case 2:
        check_actor_2_equips();
        break;
      default:
        break;
    }
  }

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.call(this);

    if (needCheckActor13) {
      needCheckActor13 = false;
      check_actor_13_equips();
    }

    if (needCheckActor11) {
      needCheckActor11 = false;
      check_actor_11_equips();
    }

    if (needCheckActor8) {
      needCheckActor8 = false;
      check_actor_8_equips();
    }

    if (needCheckActor2) {
      needCheckActor2 = false;
      check_actor_2_equips();
    }
  };
})()

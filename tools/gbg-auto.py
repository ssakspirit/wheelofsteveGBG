"""배경 놓기 조각을 자동으로 — gbg-arena.py가 만든 functions/gbg_<id>/next 를 반복 명령 블록이 8초마다 대신 실행한다.

  python tools/gbg-auto.py gbg_elytra_n gbg_elytra_s      (놓을 순서대로)
  → behavior_packs/bp0/structures/gbg_auto/cmd.mcstructure   반복 명령 블록 하나 (명령: function gbg_auto/tick, 항상 켜짐)
    behavior_packs/bp0/functions/gbg_auto/start · tick · run · stop

게임에서: 하늘에 떠서 /function gbg_auto/start → 머리 위 12칸에 명령 블록을 꺼내 티킹 에리어로 늘 켜 두고,
8초마다 지금 묶음을 놓고 다음 묶음 하늘로 날아간다. 다 놓으면 명령 블록·티킹 에리어를 스스로 지운다. 멈추기: /function gbg_auto/stop
교육용 에디션은 schedule(on_area_loaded)도, 행동 팩의 tick.json(원래 게임 파일)도 쓸 수 없어서 명령 블록을 쓴다.
"""
import os, sys, re
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import mcstruct
from mcstruct import I, B, S, C, L, block

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
BP = os.path.join(ROOT, "behavior_packs", "bp0")
WAIT = 160                                                   # 묶음 사이 틱 (8초) — 날아간 뒤 땅이 불러와질 시간
nss = [a for a in sys.argv[1:] if not a.startswith("--")]
if not nss: sys.exit("놓을 이름공간을 순서대로 (예: gbg_elytra_n gbg_elytra_s)")
groups = []
for ns in nss:
    nx = os.path.join(BP, "functions", ns, "next.mcfunction")
    if not os.path.exists(nx): sys.exit("없음: " + nx + " — 먼저 python tools/gbg-arena.py 로 조각을 만든다")
    groups.append(len(re.findall(r"run function %s/build_\d+" % ns, open(nx, encoding="utf8").read())))
K = len(nss)

# 반복 명령 블록 (월드 HQ의 명령 블록과 같은 형식, Version 39)
cmd = block("repeating_command_block", {"conditional_bit": B(0), "facing_direction": I(1)}, 18168865)
be = {"BlockEntityVersion": I(0), "Command": S("function gbg_auto/tick"), "CustomName": S(""), "ExecuteOnFirstTick": B(1),
      "LPCommandMode": I(1), "LPCondionalMode": B(0), "LPRedstoneMode": B(0), "LastExecution": (4, 0), "LastOutput": S(""),
      "LastOutputParams": L(8, []), "SuccessCount": I(0), "TickDelay": I(0), "TrackOutput": B(0), "Version": I(39), "auto": B(1),
      "conditionMet": B(0), "id": S("CommandBlock"), "powered": B(0)}
sd = os.path.join(BP, "structures", "gbg_auto"); os.makedirs(sd, exist_ok=True)
mcstruct.write_structure(os.path.join(sd, "cmd.mcstructure"), np.ones((1, 1, 1), np.int32), [mcstruct.AIR, cmd], (0, 0, 0), {(0, 0, 0): be})

fd = os.path.join(BP, "functions", "gbg_auto"); os.makedirs(fd, exist_ok=True)
w = lambda n, t: open(os.path.join(fd, n + ".mcfunction"), "w", encoding="utf8").write(t)
total = sum(g + 1 for g in groups)
w("start", "\n".join(
    ["## 배경 자동 놓기 시작 (python tools/gbg-auto.py %s 가 만든 파일) — 하늘에 떠서 실행" % " ".join(nss),
     "scoreboard objectives add gbg_auto dummy"] +
    ["scoreboard objectives add %s_step dummy\nscoreboard players set .step %s_step 0" % (ns, ns) for ns in nss] +
    ["scoreboard players set .phase gbg_auto 0", "scoreboard players set .t gbg_auto %d" % (WAIT - 40),
     "tag @a remove gbg_builder", "tag @s add gbg_builder",
     "structure load gbg_auto:cmd ~ ~12 ~", "tickingarea add circle ~ ~12 ~ 1 gbg_auto",
     'tellraw @s {"rawtext":[{"text":"§e[배경] 자동 놓기 시작 — 묶음 %d개, 8초마다 하나 (약 %d분). 끝나면 알려 줍니다. 멈추기: /function gbg_auto/stop"}]}' % (sum(groups), round(total * WAIT / 20 / 60))]) + "\n")
w("run", "\n".join(
    ["## 8초마다 (플레이어로) — 지금 이름공간의 next 한 번, 끝났으면(.step 0) 다음 이름공간으로"] +
    sum([["execute if score .phase gbg_auto matches %d run function %s/next" % (k, ns),
          "execute if score .phase gbg_auto matches %d if score .step %s_step matches 0 run scoreboard players set .phase gbg_auto %d" % (k, ns, k + 1)]
         for k, ns in enumerate(nss)], [])) + "\n")
w("tick", "\n".join(
    ["## 반복 명령 블록이 매 틱 실행 (~ = 명령 블록 자리)",
     "scoreboard players add .t gbg_auto 1",
     "execute if score .t gbg_auto matches %d.. as @a[tag=gbg_builder] at @s run function gbg_auto/run" % WAIT,
     "execute if score .t gbg_auto matches %d.. run scoreboard players set .t gbg_auto 0" % WAIT,
     "execute if score .phase gbg_auto matches %d.. run tellraw @a {\"rawtext\":[{\"text\":\"§a[배경] 자동 놓기를 마쳤습니다. 저장하고 종료한 뒤 확인을 부탁하세요.\"}]}" % K,
     "execute if score .phase gbg_auto matches %d.. run tag @a remove gbg_builder" % K,
     "execute if score .phase gbg_auto matches %d.. run tickingarea remove gbg_auto" % K,
     "execute if score .phase gbg_auto matches %d.. run setblock ~ ~ ~ air" % K]) + "\n")
w("stop", "## 자동 놓기 멈춤 (명령 블록이 다음 틱에 스스로 지운다)\nscoreboard objectives add gbg_auto dummy\nscoreboard players set .phase gbg_auto 99\n")
print(f"자동 놓기: {' → '.join(f'{ns}({g}묶음)' for ns, g in zip(nss, groups))}, 8초 간격 약 {total * WAIT / 20 / 60:.1f}분 — /function gbg_auto/start")

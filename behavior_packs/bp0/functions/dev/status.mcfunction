## [개발용] 현재 게임 상태 보기
tellraw @s {"rawtext":[{"text":"§6===== [dev] 게임 상태 ====="}]}
tellraw @s {"rawtext":[{"text":"§b.game §7(0=로비,1~6=게임) §f"},{"score":{"name":".game","objective":"global"}},{"text":"   §b.act §f"},{"score":{"name":".act","objective":"global"}},{"text":"   §b.seq §f"},{"score":{"name":".seq","objective":"global"}},{"text":"   §b.run §f"},{"score":{"name":".run","objective":"global"}}]}
tellraw @s {"rawtext":[{"text":"§b모드 §7(0=멀티,1=싱글) §f"},{"score":{"name":".game_mode","objective":"global"}},{"text":"   §4팀1 인원 §f"},{"score":{"name":".team1players","objective":"global"}},{"text":"   §9팀2 인원 §f"},{"score":{"name":".team2players","objective":"global"}}]}
tellraw @s {"rawtext":[{"text":"§4팀1 승리 §f"},{"score":{"name":".team1wins","objective":"global"}},{"text":"   §9팀2 승리 §f"},{"score":{"name":".team2wins","objective":"global"}}]}
tellraw @s {"rawtext":[{"text":"§b호스트 §f"},{"selector":"@a[tag=.host]"},{"text":"   §b관리자 §f"},{"selector":"@a[tag=admin]"}]}

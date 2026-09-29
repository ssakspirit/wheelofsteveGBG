## [개발용] 건축 모드: 크리에이티브 + 안개 끄기 + 야간 투시
## admin 태그가 있으면 10초마다 관전 모드로 바뀌므로 태그를 뗀다
execute if entity @s[tag=admin] run tellraw @s {"rawtext":[{"text":"§e[dev] 관전 모드 강제 전환을 막으려고 admin 태그를 뗐습니다. 다시 관리자가 되려면 /function admin"}]}
tag @s remove admin
gamemode creative @s
function dev/fog_off
effect @s night_vision 99999 0 true
tellraw @s {"rawtext":[{"text":"§a[dev] §f건축 모드: 크리에이티브, 안개 끔, 야간 투시"}]}

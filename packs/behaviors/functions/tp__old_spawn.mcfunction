tellraw @p[tag=allowed_old_spawn,r=10] {"rawtext":[{"translate":"§aYou have been teleported to the the Old Spawn"}]}
tag @p[tag=allowed_old_spawn,r=10] remove in_safe_zone
tag @p[tag=allowed_old_spawn,r=10] remove in_protected_zone
effect @p[tag=allowed_old_spawn,r=10] resistance 5 255 false
tp @p[tag=allowed_old_spawn,r=10] 307 67 8

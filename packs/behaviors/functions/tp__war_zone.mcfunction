tellraw @p[r=10] {"rawtext":[{"translate":"§aYou have been teleported to the §cWar Zone"}]}
tag @p[r=10] remove in_safe_zone
tag @p[r=10] remove in_protected_zone
effect @p[r=10] resistance 30 255 false
spreadplayers -20060 -20010 50 500 @p[r=10]

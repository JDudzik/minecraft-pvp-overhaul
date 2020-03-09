execute @s ~ 270 ~ tp @s ^^-0.01^3.99 facing @p

execute @p ~ 270 ~ tag @e[type=boi:cave_master,r=10] add first
execute @e[type=boi:cave_master,tag=first] ~~~ kill @e[type=boi:cave_master,rm=10,r=45]



execute @a ~~~ fill ~5~5~5 ~-5~-5~-5 stone 0 replace spawn_stone 0
execute @a ~~~ fill ~5~5~5 ~-5~-5~-5 snow_stone 0 replace snow_spawn_stone 0
execute @a ~~~ fill ~5~5~5 ~-5~-5~-5 desert_stone 0 replace desert_spawn_stone 0



effect @e[r=2] regeneration 1 1



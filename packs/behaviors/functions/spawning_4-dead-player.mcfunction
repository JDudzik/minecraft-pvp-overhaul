scoreboard players remove @a[r=20,tag=!ignore_spawn_sequence,tag=!processed,tag=existing_player] money 15000
tellraw @a[r=20,tag=!ignore_spawn_sequence,tag=!processed,tag=existing_player] {"rawtext":[{"translate":"§cYou have died! §fYou have lost §615,000 Coins"}]}
scoreboard players add @a[tag=!in_safe_zone,tag=!no_pvp_player] money 5000
tellraw @a[tag=!in_safe_zone,tag=!no_pvp_player] {"rawtext":[{"translate":"§fA player has died and you have been awarded §65,000 Coins§f for surviving in the §cWar Zone"}]}

scoreboard players remove @a[r=20,tag=!ignore_spawn_sequence,tag=!processed,tag=existing_player] money 15000
msg @a[r=20,tag=!ignore_spawn_sequence,tag=!processed,tag=existing_player] "§cYou have died! §fYou have lost §615,000 Coins"
scoreboard players add @a[tag=!in_safe_zone,tag=!no_pvp_player] money 5000
msg @a[tag=!in_safe_zone,tag=!no_pvp_player] "§fA player has died and you have been awarded §65,000 Coins§f for surviving in the §cWar Zone"

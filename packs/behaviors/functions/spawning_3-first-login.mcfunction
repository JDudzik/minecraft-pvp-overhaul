tellraw @a[r=20,tag=!ignore_spawn_sequence,tag=!processed,tag=!existing_player] {"rawtext":[{"translate":"§fYou have entered §6The Playground! §fThis is a dedicated §cPVP server. §fYou will be safe in the town until you use the §ateleporter §fto enter the §cwar zone! §fHave fun! :D"}]}
scoreboard players add @a[r=20,tag=!ignore_spawn_sequence,tag=!processed,tag=!existing_player] money 5000
tag @a[r=20,tag=!ignore_spawn_sequence,tag=!existing_player,tag=!processed] add existing_player

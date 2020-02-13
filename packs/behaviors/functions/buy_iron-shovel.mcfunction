# /scoreboard players test @p money 1600
scoreboard players remove @p money 1600
give @p iron_shovel 1
tellraw @p {"rawtext":[{"translate":"§aBought§6§l %%s §f%%s§r§7 for§e§l %%s §r§7Coins", "with":["1","Iron Shovel","1,600"]}]}

#§abuy §61
#§fIron Shovel
#§e1600 §7coins

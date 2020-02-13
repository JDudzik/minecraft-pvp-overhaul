# /scoreboard players test @p money 12550
scoreboard players remove @p money 12550
give @p diamond_shovel 1
tellraw @p {"rawtext":[{"translate":"§aBought§6§l %%s §f%%s§r§7 for§e§l %%s §r§7Coins", "with":["1","Diamond Shovel","12,550"]}]}

#§abuy §61
#§fDiamond Shovel
#§e12550 §7coins

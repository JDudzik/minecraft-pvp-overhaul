# /scoreboard players test @p money 37500
scoreboard players remove @p money 37500
give @p diamond_axe 1
tellraw @p {"rawtext":[{"translate":"§aBought§6§l %%s §f%%s§r§7 for§e§l %%s §r§7Coins", "with":["1","Diamond Axe","37,500"]}]}

#§abuy §61
#§fDiamond Axe
#§e37500 §7coins

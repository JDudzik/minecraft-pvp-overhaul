# /scoreboard players test @p money 4600
scoreboard players remove @p money 4600
give @p iron_axe 1
tellraw @p {"rawtext":[{"translate":"§aBought§6§l %%s §f%%s§r§7 for§e§l %%s §r§7Coins", "with":["1","Iron Axe","4,600"]}]}

#§abuy §61
#§fIron Axe
#§e4600 §7coins

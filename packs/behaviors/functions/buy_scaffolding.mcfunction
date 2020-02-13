# /scoreboard players test @p money 640
scoreboard players remove @p money 640
give @p scaffolding 32
tellraw @p {"rawtext":[{"translate":"§aBought§6§l %%s §f%%s§r§7 for§e§l %%s §r§7Coins", "with":["32","Scaffoldings","640"]}]}

#§abuy §632
#§fScaffoldings
#§e640 §7coins

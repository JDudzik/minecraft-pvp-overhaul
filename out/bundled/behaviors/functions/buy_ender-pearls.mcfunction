# /scoreboard players test @p money 3360
scoreboard players remove @p money 3360
give @p ender_pearl 16
tellraw @p {"rawtext":[{"translate":"§aBought§6§l %%s §f%%s§r§7 for§e§l %%s §r§7Coins", "with":["16","Ender Pearls","3,360"]}]}

#§abuy §616
#§fEnder Pearls
#§e3360 §7coins

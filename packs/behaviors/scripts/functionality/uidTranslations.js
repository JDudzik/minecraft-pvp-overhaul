const uidToName = {
	// Neutrals
	'minecraft:pig': 'pig',
	'minecraft:sheep': 'sheep',
	'minecraft:llama': 'llama',
	'minecraft:chicken': 'llama',
	'minecraft:fox': 'fox',
	'minecraft:cow': 'cow',
	'minecraft:horse': 'horse',

	// Hostiles
	'minecraft:zombie': 'zombie',
	'minecraft:zombie_village_v2': 'zombie villager',
	'minecraft:husk': 'husk',
	'minecraft:drowned': 'drowned',
	'minecraft:skeleton': 'skeleton',
	'minecraft:creeper': 'creeper',
	'minecraft:spider': 'spider',
	'minecraft:cave_spider': 'cave spider',
	'minecraft:wither_skeleton': 'wither skeleton',
	'minecraft:slime': 'slime',
	'minecraft:zombie_pigman': 'zombie pigman',
	'minecraft:ghast': 'ghast',
	'minecraft:blaze': 'blaze',
	'minecraft:enderman': 'enderman',
	'minecraft:phantom': 'phantom',
	'minecraft:magma_cube': 'magma cube',
}

const uidToValue = {
	'minecraft:zombie': 30,
	'minecraft:zombie_village_v2': 30,
	'minecraft:husk': 30,
	'minecraft:drowned': 30,
	'minecraft:skeleton': 60,
	'minecraft:creeper': 60,
	'minecraft:spider': 60,
	'minecraft:cave_spider': 50,
	'minecraft:slime': 20,
	'minecraft:wither_skeleton': 125,
	'minecraft:zombie_pigman': 100,
	'minecraft:ghast': 150,
	'minecraft:blaze': 125,
	'minecraft:enderman': 100,
	'minecraft:phantom': 125,
	'minecraft:magma_cube': 60,
}


export default {uidToName, uidToValue}

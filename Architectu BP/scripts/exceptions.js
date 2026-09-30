// Basado en la lista OFICIAL COMPLETA de Microsoft Learn (vanilla block listing).
// Revisado bloque por bloque para evitar que un sufijo "atrape" por accidente
// algo que SI es solido (ej: NO se uso "_stem" solo porque hubiera atrapado
// "crimson_stem"/"warped_stem", que son troncos completos y solidos).

// Sufijos verificados con endsWith() - ninguno choca con un bloque solido real
export const WALL_NON_CONNECTING_SUFFIXES = [
	"_button",
	"_pressure_plate",
	"_trapdoor",
	"_fence", // no choca con "_fence_gate"
	"_sign", // cubre standing/wall/hanging de todos los materiales
	"_banner",
	"_rail", // golden/activator/detector (falta "rail" solo, va en exact)
	"_torch", // incluye colored_torch_*, copper_torch, underwater_torch, etc.
	"_lantern",
	"_carpet", // incluye moss_carpet, pale_moss_carpet
	"_sapling",
	"_bud", // small/medium/large_amethyst_bud
	"_with_berries", // cave_vines_body/head_with_berries
	"_wart", // solo atrapa "nether_wart" (NO "nether_wart_block", que es solido)
	"_tulip",
	"_bush", // sweet_berry_bush, firefly_bush
	"_fern",
	"_grass", // short_grass, tall_grass, short/tall_dry_grass
];

// Se revisan con includes() en vez de endsWith porque el patron aparece
// en medio del nombre, no siempre al final (candle_cake, coral_fan, etc.)
export const WALL_NON_CONNECTING_INCLUDES = [
	"candle", // candle y candle_cake de todos los colores
	"coral_fan", // coral_fan y coral_wall_fan (coral_block/coral solo, NO van aqui: son solidos)
];

// Nombres exactos - no comparten un patron seguro con nada mas
export const WALL_NON_CONNECTING_EXACT = [
	"minecraft:allium",
	"minecraft:amethyst_cluster",
	"minecraft:azure_bluet",
	"minecraft:barrier",
	"minecraft:beetroot",
	"minecraft:big_dripleaf",
	"minecraft:blue_orchid",
	"minecraft:brown_mushroom",
	"minecraft:bubble_column",
	"minecraft:bush",
	"minecraft:cactus",
	"minecraft:cactus_flower",
	"minecraft:cake",
	"minecraft:carrots",
	"minecraft:cave_vines",
	"minecraft:chorus_flower",
	"minecraft:chorus_plant",
	"minecraft:closed_eyeblossom",
	"minecraft:cocoa",
	"minecraft:cornflower",
	"minecraft:crimson_fungus",
	"minecraft:crimson_roots",
	"minecraft:dandelion",
	"minecraft:daylight_detector",
	"minecraft:daylight_detector_inverted",
	"minecraft:deadbush",
	"minecraft:decorated_pot",
	"minecraft:dragon_egg",
	"minecraft:dried_ghast",
	"minecraft:end_rod",
	"minecraft:farmland",
	"minecraft:fern",
	"minecraft:fire",
	"minecraft:firefly_bush",
	"minecraft:flower_pot",
	"minecraft:flowering_azalea",
	"minecraft:flowing_lava",
	"minecraft:flowing_water",
	"minecraft:frame",
	"minecraft:glow_frame",
	"minecraft:frog_spawn",
	"minecraft:frosted_ice",
	"minecraft:glow_lichen",
	"minecraft:golden_dandelion",
	"minecraft:grindstone",
	"minecraft:hanging_roots",
	"minecraft:kelp",
	"minecraft:ladder",
	"minecraft:large_amethyst_bud",
	"minecraft:lava",
	"minecraft:leaf_litter",
	"minecraft:lectern",
	"minecraft:lever",
	"minecraft:lilac",
	"minecraft:lily_of_the_valley",
	"minecraft:mangrove_propagule",
	"minecraft:melon_stem",
	"minecraft:nether_sprouts",
	"minecraft:open_eyeblossom",
	"minecraft:oxeye_daisy",
	"minecraft:pale_hanging_moss",
	"minecraft:peony",
	"minecraft:pink_petals",
	"minecraft:pitcher_crop",
	"minecraft:pitcher_plant",
	"minecraft:pointed_dripstone",
	"minecraft:poppy",
	"minecraft:portal",
	"minecraft:potatoes",
	"minecraft:powder_snow",
	"minecraft:pumpkin_stem",
	"minecraft:rail",
	"minecraft:red_mushroom",
	"minecraft:red_shrub",
	"minecraft:redstone_wire",
	"minecraft:reeds",
	"minecraft:rose_bush",
	"minecraft:scaffolding",
	"minecraft:sculk_vein",
	"minecraft:sea_pickle",
	"minecraft:seagrass",
	"minecraft:shelf_mushroom",
	"minecraft:skeleton_skull",
	"minecraft:small_amethyst_bud",
	"minecraft:small_dripleaf_block",
	"minecraft:sniffer_egg",
	"minecraft:snow_layer",
	"minecraft:soul_fire",
	"minecraft:spore_blossom",
	"minecraft:structure_void",
	"minecraft:sunflower",
	"minecraft:sweet_berry_bush",
	"minecraft:target",
	"minecraft:torchflower",
	"minecraft:torchflower_crop",
	"minecraft:trip_wire",
	"minecraft:tripwire_hook",
	"minecraft:turtle_egg",
	"minecraft:twisting_vines",
	"minecraft:vine",
	"minecraft:waterlily",
	"minecraft:web",
	"minecraft:weeping_vines",
	"minecraft:wheat",
	"minecraft:wildflowers",
	"minecraft:wither_rose",
	"minecraft:wither_skeleton_skull",
	"minecraft:zombie_head",
	"minecraft:creeper_head",
	"minecraft:piglin_head",
	"minecraft:player_head",
	"minecraft:dragon_head",
];

/**
 * Revisa si un bloque, por su typeId, es de un tipo al que las paredes
 * normalmente no se conectan (no es solido/full block).
 * @param {string} typeId
 * @returns {boolean}
 */
export function isNonConnectingBlock(typeId) {
	if (WALL_NON_CONNECTING_EXACT.includes(typeId)) return true;
	if (WALL_NON_CONNECTING_SUFFIXES.some((suffix) => typeId.endsWith(suffix))) return true;
	if (WALL_NON_CONNECTING_INCLUDES.some((part) => typeId.includes(part))) return true;

	// caso especial: "_slab" cuenta, pero "_double_slab" NO (es un bloque completo)
	if (typeId.endsWith("_slab") && !typeId.endsWith("_double_slab")) return true;
	return false;
}

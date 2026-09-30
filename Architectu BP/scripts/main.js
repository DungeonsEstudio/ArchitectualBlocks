import { Direction, ItemStack, system, world } from "@minecraft/server";
import { setConnections } from "./wall_tick.js";

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
	blockComponentRegistry.registerCustomComponent("archt:wall_connections", WallConnectionComponent);
});

const WallConnectionComponent = {
	onTick: ({ block }) => {
		setConnections(block);
	},
};

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
	if (!event.isFirstEvent) return;

	const { block, player, itemStack, blockFace } = event;

	if (!block.typeId.endsWith("_slab")) return;
	if (itemStack?.typeId !== block.typeId) return;

	const isDouble = block.permutation.getState("archt:is_double");

	if (isDouble) return;

	const verticalHalf = block.permutation.getState("minecraft:vertical_half");

	const canDouble =
		(verticalHalf === "bottom" && blockFace === Direction.Up) ||
		(verticalHalf === "top" && blockFace === Direction.Down);

	if (!canDouble) return;
	system.run(() => {
		block.setPermutation(block.permutation.withState("archt:is_double", true));
		block.dimension.playSound("use.stone", block.location);
	});
	event.cancel = true;
	system.run(() => {
		consumeItem(player);
	});
});

/** @param {import("@minecraft/server").Player} player */
function consumeItem(player) {
	if (player.getGameMode() === "Creative") return;
	const inventory = player.getComponent("inventory").container;
	const item = inventory.getItem(player.selectedSlotIndex);
	if (!item) return;
	const newItem = item.amount > 1 ? new ItemStack(item.typeId, item.amount - 1) : undefined;
	inventory.setItem(player.selectedSlotIndex, newItem);
}

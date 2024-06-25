import React from "react";
import { ViroARScene, ViroBox, ViroMaterials } from "@reactvision/react-viro";

ViroMaterials.createMaterials({
	grid: {
		diffuseTexture: require("../assets/images/grid_bg.png"),
	},
});

export default function ARScene() {
	return (
		<ViroARScene>
			<ViroBox
				position={[0, 0, -1]}
				scale={[0.3, 0.3, 0.3]}
				materials={["grid"]}
			/>
		</ViroARScene>
	);
}

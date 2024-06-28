import type React from "react";
import { useState } from "react";
import {
	ViroARScene,
	ViroText,
	ViroTrackingStateConstants,
	ViroARPlaneSelector,
	ViroNode,
	ViroButton,
	ViroFlexView,
	ViroBox,
	ViroMaterials,
} from "@reactvision/react-viro";
import { detectText, translateText } from "../utils/textProcessing";

interface DetectedText {
	text: string;
	translation: string;
	position: [number, number, number];
}

ViroMaterials.createMaterials({
	grid: {
		diffuseTexture: require("../assets/images/grid_bg.png"),
	},
});

interface AnchorFoundObject {
	position: [number, number, number];
	rotation: [number, number, number];
	scale: [number, number, number];
}

const ARScene: React.FC = () => {
	const [text, setText] = useState("Initializing AR...");

	const onInitialized = (
		state: ViroTrackingStateConstants,
		reason: string,
	): void => {
		if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
			setText("Hello World!");
		} else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
			setText("Tracking lost.");
		}
	};

	const onPlaneSelected = (anchor: AnchorFoundObject): void => {
		console.log("Plane selected:", anchor);
		setText("Plane selected!");
	};
	/*
	return (
		<ViroARScene>
			<ViroBox
				position={[0, 0, -1]}
				scale={[0.3, 0.3, 0.3]}
				materials={["grid"]}
			/>
		</ViroARScene>
	);
*/

	return (
		<ViroARScene
			anchorDetectionTypes="PlanesHorizontal"
			onTrackingUpdated={onInitialized}
		>
			<ViroText
				text={text}
				scale={[0.5, 0.5, 0.5]}
				position={[0, 0, -1]}
				style={{ fontFamily: "Arial", fontSize: 20, color: "white" }}
			/>
			{/* Commented out the ViroARPlaneSelector for now
			<ViroARPlaneSelector
				minHeight={0.5}
				minWidth={0.5}
				alignment={"Horizontal"}
				onPlaneSelected={onPlaneSelected}
			>
				<ViroNode>
					<ViroText
						text="Plane Detected"
						scale={[0.1, 0.1, 0.1]}
						position={[0, 0, 0]}
						style={{ fontFamily: "Arial", fontSize: 20, color: "white" }}
					/>
				</ViroNode>
			</ViroARPlaneSelector> */}
		</ViroARScene>
	);
};

export default ARScene;

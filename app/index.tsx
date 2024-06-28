import React from "react";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import ARScene from "../components/ARScene";

const initialScene = {
	scene: ARScene,
};

export default function App() {
	return (
		<ViroARSceneNavigator
			initialScene={initialScene}
			autofocus={true}
			worldAlignment="GravityAndHeading"
			style={{ flex: 1 }}
		/>
	);
}

import React from "react";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import ARScene from "../components/ARScene";

export default function App() {
	return (
		<ViroARSceneNavigator
			initialScene={{
				scene: ARScene,
			}}
			style={{ flex: 1 }}
		/>
	);
}

import React, { useRef } from "react";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import ARScene from "../components/ARScene";
import {
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	Text,
	View,
} from "react-native";

const initialScene = {
	scene: ARScene,
};

export default function App() {
	const arSceneRef = useRef(null);

	const onDetectText = () => {
		if (arSceneRef.current) {
			arSceneRef.current.onDetectText();
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<ViroARSceneNavigator
				initialScene={{ scene: ARScene, passProps: { ref: arSceneRef } }}
				autofocus={true}
				worldAlignment="GravityAndHeading"
				style={{ flex: 1 }}
				ref={arSceneRef}
			/>
			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.button} onPress={onDetectText}>
					<Text style={styles.buttonText}>Detect Text</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		zIndex: 1000,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	buttonContainer: {
		marginBottom: 20,
	},
	button: {
		padding: 10,
		backgroundColor: "#007BFF",
		borderRadius: 5,
	},
	buttonText: {
		color: "#FFF",
		fontSize: 16,
		textAlign: "center",
	},
});

import React, { useState, useRef } from "react";

import { ViroARSceneNavigator } from "@reactvision/react-viro";
import ARScene from "../components/ARScene";
import {
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	Text,
	View,
	Button,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { detectText, translateText } from "../utils/textProcessing";

const initialScene = {
	scene: ARScene,
};

export default function App() {
	const arSceneRef = useRef(null);
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const onDetectText = async () => {
		if (isProcessing || !cameraRef.current) return;

		setIsProcessing(true);
		//setText("Detecting and translating text...");

		try {
			// Capture the image from the camera
			console.log("capturing image");
			const photo = await cameraRef.current.takePictureAsync({ base64: true });
			const image = { uri: photo.uri };
			console.log("captured image", image);

			// Process the captured image for text detection
			const detectedTextAreas = await detectText(image);
			console.log("detected text areas", detectedTextAreas);
			const translatedTextAreas = await Promise.all(
				detectedTextAreas.map(async (area) => ({
					...area,
					translation: await translateText(area.text),
				})),
			);

			console.log("Detected text areas:", translatedTextAreas);
			//setDetectedTexts(translatedTextAreas);
			//setText("Text translated");
		} catch (error) {
			console.error("Error detecting text:", error);
			//setText("Error detecting text");
		} finally {
			setIsProcessing(false);
		}
	};

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
				}}
			>
				<Text style={{ textAlign: "center" }}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title="grant permission" />
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<CameraView style={{ flex: 1 }} facing="back" ref={cameraRef} />
			{/* 	<ViroARSceneNavigator
				initialScene={{ scene: ARScene, passProps: { ref: arSceneRef } }}
				autofocus={true}
				worldAlignment="GravityAndHeading"
				style={{ flex: 1 }}
				ref={arSceneRef}
			/> */}
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

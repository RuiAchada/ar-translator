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
	const [translatedTextAreas, setTranslatedTextAreas] = useState([]);
	const [cameraViewDimensions, setCameraViewDimensions] = useState({
		width: 0,
		height: 0,
	});
	const [imageDimensions, setImageDimensions] = useState({
		width: 0,
		height: 0,
	});

	const onDetectText = async () => {
		if (isProcessing || !cameraRef.current) return;

		setIsProcessing(true);
		//setText("Detecting and translating text...");

		try {
			// Capture the image from the camera
			const photo = await cameraRef.current.takePictureAsync({ base64: true });
			const image = {
				uri: photo.uri,
				width: photo.width,
				height: photo.height,
			};
			setImageDimensions({ width: photo.width, height: photo.height });

			// Process the captured image for text detection
			const detectedTextAreas = await detectText(image);
			const translatedTextAreas = await Promise.all(
				detectedTextAreas.map(async (area) => ({
					...area,
					translation: await translateText(area.text),
				})),
			);

			setTranslatedTextAreas(translatedTextAreas); // Save the translated text areas

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

	const renderTextAreas = () => {
		console.log("renderTextAreas called with", translatedTextAreas);
		return translatedTextAreas.map((area, index) => {
			const adjustedFrame = {
				left:
					(area.frame.left / imageDimensions.width) *
					cameraViewDimensions.width,
				top:
					(area.frame.top / imageDimensions.height) *
					cameraViewDimensions.height,
				width:
					(area.frame.width / imageDimensions.width) *
					cameraViewDimensions.width,
				height:
					(area.frame.height / imageDimensions.height) *
					cameraViewDimensions.height,
			};

			console.log("adjustedFrame", adjustedFrame);

			return (
				<View
					key={index}
					style={[
						styles.textArea,
						{
							left: adjustedFrame.left,
							top: adjustedFrame.top,
							width: adjustedFrame.width,
							height: adjustedFrame.height,
						},
					]}
				>
					<Text style={styles.text}>{area.translation}</Text>
				</View>
			);
		});
	};

	return (
		<View style={{ flex: 1 }}>
			<CameraView
				style={{ flex: 1 }}
				facing="back"
				ref={cameraRef}
				onLayout={(event) => {
					const { width, height } = event.nativeEvent.layout;
					setCameraViewDimensions({ width, height });
				}}
			/>
			<View style={StyleSheet.absoluteFillObject}>{renderTextAreas()}</View>
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
		position: "absolute",
		bottom: 0,
		width: "100%",
		alignItems: "center",
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
	textArea: {
		position: "absolute",
		borderColor: "red",
		borderWidth: 2,
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		zIndex: 1000, // Ensures text areas are above the camera view
	},
	text: {
		fontSize: 12,
		color: "black",
	},
});

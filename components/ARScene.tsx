import type React from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import {
	ViroARScene,
	ViroText,
	ViroTrackingStateConstants,
	ViroNode,
	ViroFlexView,
} from "@reactvision/react-viro";
import { detectText, translateText } from "../utils/textProcessing";

interface DetectedText {
	text: string;
	translation: string;
	position: [number, number, number];
}

const ARScene = forwardRef((props, ref) => {
	const [text, setText] = useState("Initializing AR...");
	const [detectedTexts, setDetectedTexts] = useState<DetectedText[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);

	const onInitialized = (
		state: ViroTrackingStateConstants,
		reason: string,
	): void => {
		if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
			setText("AR Ready");
		} else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
			setText("Tracking lost");
		}
	};

	const onDetectText = async () => {
		if (isProcessing) return;

		setIsProcessing(true);
		setText("Detecting and translating text...");

		try {
			// This uses the device camera to capture an image
			// and then process it for text detection
			const detectedTextAreas = await detectText();
			const translatedTextAreas = await Promise.all(
				detectedTextAreas.map(async (area) => ({
					...area,
					translation: await translateText(area.text),
				})),
			);
			console.log("Detected text areas:", translatedTextAreas);
			setDetectedTexts(translatedTextAreas);
			setText("Text translated");
		} catch (error) {
			console.error("Error detecting text:", error);
			setText("Error detecting text");
		} finally {
			setIsProcessing(false);
		}
	};

	useImperativeHandle(ref, () => ({
		onDetectText,
	}));

	return (
		<ViroARScene onTrackingUpdated={onInitialized}>
			<ViroText
				text={text}
				scale={[0.3, 0.3, 0.3]}
				position={[0, 0, -1]}
				style={{ fontFamily: "Arial", fontSize: 20, color: "white" }}
			/>
			{detectedTexts.map((item, index) => (
				<ViroNode key={index} position={item.position}>
					<ViroFlexView
						style={{
							padding: 0.05,
							backgroundColor: "#FFFFFF80",
							borderRadius: 0.05,
						}}
					>
						<ViroText
							text={item.translation}
							scale={[0.05, 0.05, 0.05]}
							style={{ fontFamily: "Arial", fontSize: 12, color: "black" }}
						/>
					</ViroFlexView>
				</ViroNode>
			))}
		</ViroARScene>
	);
});

export default ARScene;

import type React from "react";
import {
	forwardRef,
	useImperativeHandle,
	useState,
	useRef,
	useEffect,
} from "react";
import {
	ViroARScene,
	ViroText,
	ViroTrackingStateConstants,
	ViroNode,
	ViroFlexView,
} from "@reactvision/react-viro";

interface DetectedText {
	text: string;
	translation: string;
	position: [number, number, number];
}

const ARScene = forwardRef((props, ref) => {
	const [logsText, setText] = useState("Initializing AR...");
	const [detectedTexts, setDetectedTexts] = useState<DetectedText[]>([]);

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

	return (
		<ViroARScene onTrackingUpdated={onInitialized}>
			<ViroText
				text={logsText}
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

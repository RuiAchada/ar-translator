import TextRecognition, {
	TextRecognitionScript,
} from "@react-native-ml-kit/text-recognition";
import axios from "axios";

export const detectText = async (image: { uri: string }): Promise<
	DetectedTextBlock[]
> => {
	try {
		const result = await TextRecognition.recognize(
			image.uri,
			TextRecognitionScript.JAPANESE,
		);

		// Extract blocks with frame data for positioning
		const blocks = result.blocks.map((block) => ({
			text: block.text,
			frame: {
				left: block.frame.left,
				top: block.frame.top,
				width: block.frame.width,
				height: block.frame.height,
			},
		}));

		return blocks;
	} catch (error) {
		console.error("Error detecting text:", error);
		throw error;
	}
};

/*export const detectText = async (
	image: textRecognition.VisionImage,
): Promise<DetectedTextBlock[]> => {
	try {
		// First let's return an example array of text blocks
		/* 		return [
			{
				text: "こんにちは",
				position: { x: 100, y: 100 },
			},
			{
				text: "世界",
				position: { x: 200, y: 200 },
			},
		];
		//const imagePath = require("./example_japanese.png");
		const imagePath =
			"https://m.media-amazon.com/images/I/B14v3-UKcgL._SY300_.jpg";
		console.log("imagePath", imagePath);
		//const imagePath = "file://./example_japanese.png";
		const result = await TextRecognition.recognize(
			imagePath,
			TextRecognitionScript.JAPANESE,
		);
		console.log("RESULT", result);
		// Process the result and extract the recognized text areas
		const detectedTextAreas = result.blocks.map((block) => ({
			text: block.text,
			//position: [block.boundingBox.left, block.boundingBox.top, 0], // Adjust position as needed
			position: [0.5, 0.5, 0],
		}));

		return detectedTextAreas;
	} catch (error) {
		console.error("Error detecting text:", error);
		throw error;
	}
};*/

export const translateText = async (text: string): Promise<string> => {
	try {
		const response = await axios.get(
			"https://api.mymemory.translated.net/get",
			{
				params: {
					q: text,
					langpair: "ja|en",
				},
			},
		);
		return response.data.responseData.translatedText;
	} catch (error) {
		console.error("Error translating text:", error);
		throw error;
	}
};

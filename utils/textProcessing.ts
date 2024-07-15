import TextRecognition, {
	TextRecognitionScript,
} from "@react-native-ml-kit/text-recognition";
//import TranslateText, {
//  TranslateLanguage,
//} from '@react-native-ml-kit/translate-text'; // other package to translate

import axios from "axios";

export const detectText = async (image: { uri: string }): Promise<
	DetectedTextBlock[]
> => {
	try {
		const result = await TextRecognition.recognize(
			image.uri,
			TextRecognitionScript.JAPANESE,
		);

		console.log("Detected text: ", result);

		// Regular expression to match Japanese characters
		const japaneseRegex =
			/[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF]/;

		// Extract blocks with frame data for positioning
		const blocks = result.blocks
			.filter((block) => japaneseRegex.test(block.text)) // ignore non-Japanese text
			.map((block) => ({
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

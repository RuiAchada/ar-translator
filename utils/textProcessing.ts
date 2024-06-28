//import * as Vision from "@react-native-ml-kit/vision";
import axios from "axios";

export const detectText = async (
	image: Vision.VisionImage,
): Promise<DetectedTextBlock[]> => {
	try {
		// First let's return an example array of text blocks
		return [
			{
				text: "こんにちは",
				position: { x: 100, y: 100 },
			},
			{
				text: "世界",
				position: { x: 200, y: 200 },
			},
		];

		const result = await Vision.textRecognizer().process(image);
		return result.blocks.map((block) => ({
			text: block.text,
			position: {
				x: (block.frame.left + block.frame.right) / 2,
				y: (block.frame.top + block.frame.bottom) / 2,
			},
		}));
	} catch (error) {
		console.error("Error detecting text:", error);
		throw error;
	}
};

export const translateText = async (text: string): Promise<string> => {
	try {
		return "THIS IS TRANSLATED TEXT";
		const response = await axios.post<{ translated_text: string }>(
			"TRANSLATION_API_ENDPOINT",
			{
				text: text,
				source_language: "ja",
				target_language: "en",
			},
		);
		return response.data.translated_text;
	} catch (error) {
		console.error("Error translating text:", error);
		throw error;
	}
};

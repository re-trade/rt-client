import { unAuthApi } from '@retrade/util';

type AISuggestResponse = {
  status: string;
  message: string;
  data: {
    suggestions: string[];
    random_suggestion: string;
  };
};

type AICorrectSpellResponse = {
  status: string;
  message: string;
  data: {
    suggestions: string[];
    random_suggestion: string;
  };
};

export const textModApi = {
  suggestReply: async (payload: { review: string; rating: number }): Promise<AISuggestResponse> => {
    const response = await unAuthApi.textModeration.post<AISuggestResponse>(
      '/product-review/suggest-reply',
      payload,
    );
    return response.data;
  },
  correctSpell: async (payload: { comment: string }): Promise<AICorrectSpellResponse> => {
    const response = await unAuthApi.textModeration.post<AICorrectSpellResponse>(
      '/comment',
      payload,
    );
    return response.data;
  },
};

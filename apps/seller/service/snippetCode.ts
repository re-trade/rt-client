

export const snipppetCode = {
   cutCode(code: string) {
    if (!code) {
      return null;
    }

    const parts = code.split('-');
    return parts[parts.length - 1];
  },
};

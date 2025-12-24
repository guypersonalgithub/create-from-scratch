type GenerateCryptoRandomStringArgs = {
  length: number;
  alphabet?: string;
};

export const generateCryptoRandomStringArgs = ({
  length,
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
}: GenerateCryptoRandomStringArgs) => {
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  const chars = alphabet.length;
  let result = "";

  for (let i = 0; i < length; i++) {
    result += alphabet[randomValues[i] % chars];
  }

  return result;
};

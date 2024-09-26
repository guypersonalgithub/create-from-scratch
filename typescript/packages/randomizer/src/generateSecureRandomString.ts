export const generateSecureRandomString = () => {
  const length = 24; // 24 characters in base-36 provide around 124 bits of entropy
  const array = new Uint8Array(length);
  crypto.getRandomValues(array); // Use crypto API for secure random numbers

  let id = "";
  for (let i = 0; i < length; i++) {
    id += array[i].toString(36).padStart(2, "0"); // Convert each byte to a base-36 character
  }

  return id.substring(0, length); // Ensure the length is exactly what we need
};

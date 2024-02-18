export const blobUrlToBase64 = async (input: any) => {
  const response = await fetch(input);

  const blob = await response.blob();

  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      // Use the base64Data as needed
      resolve(base64Data);
    };
    reader.readAsDataURL(blob);
  });
};

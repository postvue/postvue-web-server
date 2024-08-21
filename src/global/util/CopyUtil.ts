export const copyClipBoard = (copyText: string): void => {
  const textarea = document.createElement('textarea');
  textarea.value = copyText;

  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, 9999);

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }

  document.body.removeChild(textarea);
};

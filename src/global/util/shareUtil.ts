export const handleShareUtil = async (props: {
  url: string;
  text?: string;
  title?: string;
}): Promise<void> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.url,
        text: props.text,
        url: props.title,
      });
    } catch (error) {
      console.error('Error sharing', error);
    }
  }
};

export const getRandomImage = (list: string[], extraImage: string): string => {
  if (list.length === 0) {
    return extraImage;
  }
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};

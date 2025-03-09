export interface ShareInfo {
  url: string;
  text?: string;
  title?: string;
}

export const handleShareUtil = async (props: ShareInfo): Promise<void> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.title,
        text: props.text,
        url: props.url,
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

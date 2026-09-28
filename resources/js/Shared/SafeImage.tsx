interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
};

export default function SafeImage({ src, fallback, ...props }: ImageProps): React.JSX.Element {
  const imageSrc = (src === null || src === undefined || src === '') ? fallback : src;

  return (
    <img
      src={imageSrc}
      onError={(e) => {
        const target = e.currentTarget;
        if (fallback !== undefined && target.src !== fallback) {
          target.src = fallback;
        }
      }}
      {...props}
    />
  );
};

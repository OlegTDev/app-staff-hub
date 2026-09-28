type PlaceholderProps = {
  text: string;
  width?: number;
  height? :number;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
};

export default function getSvgPlaceholder({
  text,
  width = 600,
  height = 400,
  backgroundColor = '#cccccc',
  textColor = '#999',
  fontFamily = 'sans-serif',
}: PlaceholderProps): string {
  const fontSize = Math.max(12, Math.round(width / 20));

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>
    <rect width='100%' height='100%' fill='${backgroundColor}'/>
    <text x="50%" y="50%" font-family='${fontFamily}' font-weight='bold' font-size='${fontSize}' fill='${textColor}' dominant-baseline='middle' text-anchor='middle'>${text}</text>
  </svg>`;

  const bytes = new TextEncoder().encode(svg);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  const base64 = btoa(binString);

  return `data:image/svg+xml;base64,${base64}`;
}

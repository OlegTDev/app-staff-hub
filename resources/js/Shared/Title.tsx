import { Typography, theme } from "antd";
import type { TitleProps as AntdTitleProps } from "antd/es/typography/Title";


interface CustomTitleProps extends Omit<AntdTitleProps, "children"> {
  text: string;
}

export default function Title({ text, level = 1, style, ...props }: CustomTitleProps): React.JSX.Element {
  const { token } = theme.useToken();

  return (
    <>
      <Typography.Title
        level={level}
        {...props}
        style={{
          display: "flex",
          alignItems: "center",
          gap: token.marginXXS,
          margin: 0,
          marginBottom: token.marginSM,
          lineHeight: 1.3,
          ...style,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: token.lineWidth,
            height: token.lineWidth,
            borderRadius: "50%",
            backgroundColor: token.colorPrimary,
            flexShrink: 0,
            transition: "transform 0.2s ease",
          }}
        />
        {text}
      </Typography.Title>
    </>
  );
}

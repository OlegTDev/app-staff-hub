import { Typography, theme } from "antd";
import type { TitleProps as AntdTitleProps } from "antd/es/typography/Title";


interface CustomTitleProps extends Omit<AntdTitleProps, "children"> {
  text: string;
}

export default function Title({ text, level = 1, style, ...props }: CustomTitleProps): React.JSX.Element {
  const { token } = theme.useToken();

  return <>
    <Typography.Title
      level={level}
      {...props}
      style={{
        display: "flex",
        alignItems: "center",
        borderLeft: `4px solid ${token.colorPrimary}`,
        paddingLeft: token.paddingSM,
        margin: 0,
        marginBottom: token.marginLG,
        lineHeight: 1.2,
        ...style,
      }}
    >
      {text}
    </Typography.Title>
  </>;
}

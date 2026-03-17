import Svg, { Path, SvgProps } from "react-native-svg";

export default function AudioFile(props: SvgProps) {
  return (
    <Svg width="65" height="65" viewBox="0 0 65 65" fill="none" {...props}>
      <Path
        d="M54.1667 60.9375H10.8334V4.0625H40.625L54.1667 17.6042V60.9375Z"
        fill="#90CAF9"
      />
      <Path
        d="M52.1355 18.9583H39.2709V6.09375L52.1355 18.9583Z"
        fill="#E1F5FE"
      />
      <Path
        d="M31.1458 46.0416C34.1373 46.0416 36.5625 43.6165 36.5625 40.6249C36.5625 37.6334 34.1373 35.2083 31.1458 35.2083C28.1543 35.2083 25.7291 37.6334 25.7291 40.6249C25.7291 43.6165 28.1543 46.0416 31.1458 46.0416Z"
        fill="#1976D2"
      />
      <Path
        d="M40.625 28.4375L33.8541 25.7291V40.625H36.5625V31.0104L40.625 32.5V28.4375Z"
        fill="#1976D2"
      />
    </Svg>
  );
}

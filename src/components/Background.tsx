import styled from "@emotion/styled";

export const Background = styled.div<{ url: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background-image: url(${(props) => props.url});
  background-size: cover;
  image-rendering: pixelated;
  background-position: 50%;
  z-index: -1;
`;

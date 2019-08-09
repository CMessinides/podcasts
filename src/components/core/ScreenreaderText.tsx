import styled from "../../styles/styled-components";

const ScreenreaderText = styled.div`
  position: absolute;
  height: 1px;
  width: 1px;
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: polygon(0px 0px, 0px 0px, 0px 0px);
  overflow: hidden;
`;

export default ScreenreaderText;

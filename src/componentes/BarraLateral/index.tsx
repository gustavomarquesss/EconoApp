import logo from "../../assets/images/logo.png";
import styled from "styled-components";

export const Sidebar = styled.aside`
  position: fixed;
  top: 2rem;
  left: 2rem;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Circle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--cor-neutra-dark-medium);
  border-radius: 50%;
  opacity: 0.6;
  box-shadow: 0 8px 24px rgba(95, 95, 95, 0.5);
  z-index: -1;
`;

export const Imagem = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 1;
`;

const BarraLateral = () => {
  return (
    <Sidebar>
      <Circle />
      <Imagem src={logo} alt="Logotipo do EconoApp" />
    </Sidebar>
  );
};

export default BarraLateral;

import styled from "styled-components";
import ThemeToggle from "../ThemeToggle";

export const Sidebar = styled.aside`
  position: fixed;
  top: 2rem;
  left: 2rem;
  width: 200px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  z-index: 1000;
  
  @media (max-width: 1600px) {
    left: 1rem;
  }
`;

const BarraLateral = () => {
  return (
    <Sidebar>
      <ThemeToggle />
    </Sidebar>
  );
};

export default BarraLateral;

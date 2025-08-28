import React from "react";
import styled from "styled-components";
import { useTheme } from "../../context/ThemeContext";
import SunIcon from "../Icones/SunIcon";
import MoonIcon from "../Icones/MoonIcon";

const ToggleButton = styled.button`
  background: none;
  border: 2px solid var(--cor-neutra-medium);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--cor-neutra-light);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--cor-primaria);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(15deg);
  }
`;

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme} title={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </ToggleButton>
  );
};

export default ThemeToggle; 
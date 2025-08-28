import React from "react";
import styled from "styled-components";
import logo from "../../assets/images/logo.png";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showTitle?: boolean;
  titleSize?: "small" | "medium" | "large";
}

const LogoContainer = styled.div<{ $size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.$size === "small" ? "0.5rem" : props.$size === "large" ? "1.5rem" : "1rem"};
`;

const LogoImage = styled.img<{ $size: string }>`
  width: ${props => {
    switch (props.$size) {
      case "small": return "40px";
      case "large": return "120px";
      default: return "80px";
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case "small": return "40px";
      case "large": return "120px";
      default: return "80px";
    }
  }};
  object-fit: contain;
  filter: brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.3)); /* Logo branco com sombra sutil */
  transition: all 0.3s ease;
  
  /* Ajusta a cor baseada no tema */
  [data-theme="light"] & {
    filter: brightness(0) invert(0) drop-shadow(0 2px 4px rgba(0,0,0,0.2)); /* Logo preto no tema claro */
  }
  
  &:hover {
    transform: scale(1.1);
    filter: brightness(0) invert(1) drop-shadow(0 4px 8px rgba(0,0,0,0.4));
    
    [data-theme="light"] & {
      filter: brightness(0) invert(0) drop-shadow(0 4px 8px rgba(0,0,0,0.3));
    }
  }
`;

const LogoTitle = styled.h1<{ $size: string }>`
  font-size: ${props => {
    switch (props.$size) {
      case "small": return "var(--fonte-md)";
      case "large": return "var(--fonte-xxl)";
      default: return "var(--fonte-xl)";
    }
  }};
  color: var(--cor-neutra-light);
  margin: 0;
  font-weight: 600;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const Logo: React.FC<LogoProps> = ({ 
  size = "medium", 
  showTitle = false, 
  titleSize = "medium" 
}) => {
  return (
    <LogoContainer $size={size}>
      <LogoImage src={logo} alt="EconoApp Logo" $size={size} />
      {showTitle && (
        <LogoTitle $size={titleSize}>EconoApp</LogoTitle>
      )}
    </LogoContainer>
  );
};

export default Logo; 
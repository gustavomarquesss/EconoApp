import React from "react";
import styled from "styled-components";
import LogoIcon from "../Icones/LogoIcon";
import LogoModerno from "../Icones/LogoModerno";
import LogoGastosDiarios from "../Icones/LogoGastosDiarios";

const LogoSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--cor-neutra-dark-medium);
  border-radius: var(--border-radius-m);
  border: 2px solid var(--cor-neutra-medium);
`;

const LogoOptions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const LogoOption = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: ${props => props.$selected ? 'var(--cor-primaria)' : 'var(--cor-neutra-medium)'};
  border: 2px solid ${props => props.$selected ? 'var(--cor-primaria)' : 'var(--cor-neutra-medium)'};
  border-radius: var(--border-radius-s);
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--cor-neutra-light);
  
  &:hover {
    border-color: var(--cor-primaria);
    transform: translateY(-2px);
  }
`;

const LogoName = styled.span`
  font-size: var(--fonte-xs);
  font-weight: 500;
  text-align: center;
`;

interface LogoSelectorProps {
  onLogoChange: (logoType: string) => void;
  currentLogo: string;
}

const LogoSelector: React.FC<LogoSelectorProps> = ({ onLogoChange, currentLogo }) => {
  const logos = [
    { type: "gastos-diarios", name: "Gastos Diários", component: LogoGastosDiarios },
    { type: "moderno", name: "Moderno", component: LogoModerno },
    { type: "classico", name: "Clássico", component: LogoIcon },
  ];

  return (
    <LogoSelectorContainer>
      <h3 style={{ margin: 0, fontSize: "var(--fonte-md)" }}>Escolha seu Logo</h3>
      <LogoOptions>
        {logos.map((logo) => (
          <LogoOption
            key={logo.type}
            $selected={currentLogo === logo.type}
            onClick={() => onLogoChange(logo.type)}
          >
            <logo.component />
            <LogoName>{logo.name}</LogoName>
          </LogoOption>
        ))}
      </LogoOptions>
    </LogoSelectorContainer>
  );
};

export default LogoSelector; 
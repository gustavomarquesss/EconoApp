const LogoIcon = () => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Círculo de fundo */}
      <circle cx="40" cy="40" r="38" fill="var(--cor-primaria)" />
      
      {/* Gráfico de barras (representando gastos diários) */}
      <rect x="25" y="35" width="4" height="15" fill="var(--cor-neutra-light)" opacity="0.9" />
      <rect x="32" y="30" width="4" height="20" fill="var(--cor-neutra-light)" opacity="0.9" />
      <rect x="39" y="25" width="4" height="25" fill="var(--cor-neutra-light)" opacity="0.9" />
      <rect x="46" y="32" width="4" height="18" fill="var(--cor-neutra-light)" opacity="0.9" />
      <rect x="53" y="28" width="4" height="22" fill="var(--cor-neutra-light)" opacity="0.9" />
      
      {/* Símbolo de moeda no centro */}
      <circle cx="40" cy="40" r="8" fill="var(--cor-neutra-light)" />
      <text
        x="40"
        y="44"
        textAnchor="middle"
        fill="var(--cor-primaria)"
        fontSize="12"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        R$
      </text>
      
      {/* Linha de tendência */}
      <path
        d="M20 45 Q30 40 40 35 Q50 30 60 35"
        stroke="var(--cor-neutra-light)"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      
      {/* Pontos na linha de tendência */}
      <circle cx="30" cy="40" r="2" fill="var(--cor-neutra-light)" />
      <circle cx="40" cy="35" r="2" fill="var(--cor-neutra-light)" />
      <circle cx="50" cy="35" r="2" fill="var(--cor-neutra-light)" />
    </svg>
  );
};

export default LogoIcon; 
const LogoGastosDiarios = () => {
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
      
      {/* Calendário estilizado */}
      <rect x="22" y="25" width="36" height="30" rx="3" fill="var(--cor-neutra-light)" opacity="0.95" />
      
      {/* Cabeçalho do calendário */}
      <rect x="22" y="25" width="36" height="8" rx="3" fill="var(--cor-primaria)" opacity="0.8" />
      
      {/* Dias da semana */}
      <rect x="25" y="28" width="4" height="2" fill="var(--cor-neutra-light)" opacity="0.7" />
      <rect x="32" y="28" width="4" height="2" fill="var(--cor-neutra-light)" opacity="0.7" />
      <rect x="39" y="28" width="4" height="2" fill="var(--cor-neutra-light)" opacity="0.7" />
      <rect x="46" y="28" width="4" height="2" fill="var(--cor-neutra-light)" opacity="0.7" />
      <rect x="53" y="28" width="4" height="2" fill="var(--cor-neutra-light)" opacity="0.7" />
      
      {/* Destaque do dia atual (centro) */}
      <circle cx="40" cy="42" r="6" fill="var(--cor-primaria)" />
      <text
        x="40"
        y="45"
        textAnchor="middle"
        fill="var(--cor-neutra-light)"
        fontSize="10"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        HOJE
      </text>
      
      {/* Moedas ao redor */}
      <circle cx="25" cy="42" r="3" fill="var(--cor-secundaria-receita)" opacity="0.8" />
      <circle cx="55" cy="42" r="3" fill="var(--cor-secundaria-despesa)" opacity="0.8" />
      
      {/* Símbolos de moeda */}
      <text
        x="25"
        y="44"
        textAnchor="middle"
        fill="var(--cor-neutra-light)"
        fontSize="8"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        R$
      </text>
      <text
        x="55"
        y="44"
        textAnchor="middle"
        fill="var(--cor-neutra-light)"
        fontSize="8"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        R$
      </text>
      
      {/* Linha de controle diário */}
      <path
        d="M20 60 L60 60"
        stroke="var(--cor-neutra-light)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
      
      {/* Indicadores de gastos diários */}
      <circle cx="30" cy="60" r="2" fill="var(--cor-secundaria-despesa)" />
      <circle cx="40" cy="60" r="2" fill="var(--cor-secundaria-receita)" />
      <circle cx="50" cy="60" r="2" fill="var(--cor-secundaria-despesa)" />
    </svg>
  );
};

export default LogoGastosDiarios; 
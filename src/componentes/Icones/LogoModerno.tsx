const LogoModerno = () => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Círculo de fundo com gradiente sutil */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cor-primaria)" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      
      <circle cx="40" cy="40" r="38" fill="url(#logoGradient)" />
      
      {/* Círculo interno para efeito de profundidade */}
      <circle cx="40" cy="40" r="32" fill="none" stroke="var(--cor-neutra-light)" strokeWidth="1" opacity="0.3" />
      
      {/* Símbolo principal - Carteira/Portfólio estilizada */}
      <path
        d="M25 30 L55 30 Q60 30 60 35 L60 45 Q60 50 55 50 L25 50 Q20 50 20 45 L20 35 Q20 30 25 30 Z"
        fill="var(--cor-neutra-light)"
        opacity="0.95"
      />
      
      {/* Detalhes da carteira */}
      <rect x="30" y="35" width="20" height="2" fill="var(--cor-primaria)" opacity="0.8" />
      <rect x="30" y="40" width="15" height="2" fill="var(--cor-primaria)" opacity="0.6" />
      <rect x="30" y="45" width="18" height="2" fill="var(--cor-primaria)" opacity="0.4" />
      
      {/* Indicador de gastos diários - pequenos círculos */}
      <circle cx="28" cy="35" r="1.5" fill="var(--cor-secundaria-despesa)" />
      <circle cx="28" cy="40" r="1.5" fill="var(--cor-secundaria-receita)" />
      <circle cx="28" cy="45" r="1.5" fill="var(--cor-secundaria-despesa)" />
      
      {/* Linha de progresso/controle */}
      <path
        d="M25 60 L55 60"
        stroke="var(--cor-neutra-light)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
      
      {/* Indicador de progresso */}
      <circle cx="40" cy="60" r="3" fill="var(--cor-neutra-light)" />
    </svg>
  );
};

export default LogoModerno; 
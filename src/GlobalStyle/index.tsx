import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
:root {
  font-family: "Work Sans", sans-serif;
  font-optical-sizing: auto;

  /* Tamanhos de fonte */
  --fonte-xxxl: 2.438rem;
  --fonte-xxl: 1.938rem;
  --fonte-xl: 1.562rem;
  --fonte-l: 1.25rem;
  --fonte-md: 1rem;
  --fonte-s: 0.812rem;
  --fonte-xs: 0.625rem;

  /* Espaçamentos e bordas */
  --border-radius-s: 0.5rem;
  --border-radius-m: 1rem;
  --border-radius-l: 1.5rem;

  --padding-xs: 0.5rem;
  --padding-s: 0.75rem;
  --padding-m: 1.25rem;
  --padding-l: 1.5rem;
  --padding-xl: 5rem;

  --gap-xs: 0.5rem;
  --gap-s: 1rem;
  --gap-m: 1.25rem;
  --gap-l: 1.5rem;
}

/* Tema Escuro (padrão) */
[data-theme="dark"] {
  --cor-neutra-dark: #000000;
  --cor-neutra-dark-medium: #121212;
  --cor-neutra-medium: #1e1e1e;
  --cor-neutra-light: #e0e0e0;
  
  --cor-primaria: #2563eb; /* Azul moderno */
  --cor-secundaria-receita: #10b981;
  --cor-secundaria-despesa: #f97316;
}

/* Tema Claro */
[data-theme="light"] {
  --cor-neutra-dark: #ffffff;
  --cor-neutra-dark-medium: #f8f9fa;
  --cor-neutra-medium: #e9ecef;
  --cor-neutra-light: #212529;
  
  --cor-primaria: #2563eb; /* Azul moderno */
  --cor-secundaria-receita: #10b981;
  --cor-secundaria-despesa: #f97316;
}

body {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: var(--cor-neutra-dark);
  color: var(--cor-neutra-light);
  transition: background-color 0.3s ease, color 0.3s ease;
  min-height: 100vh;
  overflow-x: auto;
}

#root {
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
}
`;

export default GlobalStyle;

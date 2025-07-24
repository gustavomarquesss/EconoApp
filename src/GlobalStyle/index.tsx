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

  /* Paleta de cores moderna dark */
  --cor-neutra-dark: #000000;              /* fundo base */
  --cor-neutra-dark-medium: #121212;       /* cards e containers */
  --cor-neutra-medium: #1e1e1e;            /* bordas ou menus */
  --cor-neutra-light: #e0e0e0;             /* textos claros */
  
  --cor-primaria: #4f46e5;                 /* roxo-azulado (destaque) */
  --cor-secundaria-receita: #10b981;      /* verde para receitas */
  --cor-secundaria-despesa: #f97316;       /* laranja para despesas */

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

body {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  background-color: var(--cor-neutra-dark);
  color: var(--cor-neutra-light);
}
`;

export default GlobalStyle;

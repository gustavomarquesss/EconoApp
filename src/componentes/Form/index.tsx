import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  gap: var(--gap-l);
  
  /* Estilo para os labels */
  label {
    margin-bottom: var(--gap-xs);
  }
  
  /* Estilo para os inputs */
  input {
    margin-bottom: var(--gap-m);
  }
  
  /* Estilo para o botão */
  button {
    margin-top: var(--gap-m);
  }
`;

export default Form;

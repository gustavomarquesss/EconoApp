import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Botao from "../../componentes/Botao";
import CampoTexto from "../../componentes/CampoTexto";
import Form from "../../componentes/Form";
import Label from "../../componentes/Label";
import { Section, Container } from "./style";
import ThemeToggle from "../../componentes/ThemeToggle";
import Logo from "../../componentes/Logo";
import styled from "styled-components";

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const ThemeToggleContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

function Cadastro() {
  const [nome, setNome] = useState("");
  const [renda, setRenda] = useState("");
  const { criaUsuario } = useAppContext();
  const navigate = useNavigate();

  const aoSubmeterForm = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    await criaUsuario({
      nome,
      renda: parseFloat(renda),
    });
    navigate("/home");
  };

  return (
    <Section>
      <ThemeToggleContainer>
        <ThemeToggle />
      </ThemeToggleContainer>
      <Container>
        <LogoContainer>
          <Logo size="medium" showTitle={true} titleSize="large" />
        </LogoContainer>
        <Form onSubmit={aoSubmeterForm}>
          <Label htmlFor="nome">Nome</Label>
          <CampoTexto
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <Label htmlFor="renda">Renda mensal</Label>
          <CampoTexto
            id="renda"
            type="number"
            value={renda}
            onChange={(e) => setRenda(e.target.value)}
            required
          />

          <Botao $variante="primario" type="submit">
            Começar
          </Botao>
        </Form>
      </Container>
    </Section>
  );
}

export default Cadastro;

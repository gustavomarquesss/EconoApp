import BalancoFinanceiro from "../../componentes/BalancoFinanceiro";
import BarraLateral from "../../componentes/BarraLateral";
import BarraPesquisa from "../../componentes/BarraPesquisa";
import OrcamentoDiario from "../../componentes/OrcamentoDiario";
import SaudacaoUsuario from "../../componentes/SaudacaoUsuario";
import Transacoes from "../../componentes/Transacoes";
import GastosMes from "../../componentes/GastosMes";
import {
  Container,
  Movimentacoes,
  Orcamento,
  TransacoesWrapper,
} from "./style";

function Home() {
  return (
    <Container>
      <BarraLateral />
      <BarraPesquisa />
      <SaudacaoUsuario />
      <Orcamento>
        <OrcamentoDiario />
        <GastosMes />
      </Orcamento>
      <Movimentacoes>
        <BalancoFinanceiro />
      </Movimentacoes>
      <TransacoesWrapper>
        <Transacoes />
      </TransacoesWrapper>
    </Container>
  );
}

export default Home;

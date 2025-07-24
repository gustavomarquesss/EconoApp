import { useAppContext, useTotalGastosMes } from "../../context/AppContext";
import { Cartao, CartaoCabecalho, CartaoCorpo, Descricao } from "../Cartao";

const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const OrcamentoDiario = () => {
  const { usuario } = useAppContext();
  const totalGastos = useTotalGastosMes();

  const saldoRestante = (usuario?.renda ?? 0) - totalGastos;

  return (
    <Cartao>
      <CartaoCabecalho>Saldo restante do mês</CartaoCabecalho>
      <CartaoCorpo>
        <Descricao>{formatador.format(saldoRestante)}</Descricao>
      </CartaoCorpo>
    </Cartao>
  );
};

export default OrcamentoDiario;

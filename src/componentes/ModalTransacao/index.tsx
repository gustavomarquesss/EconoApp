import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { ButtonGroup, CloseButton, ModalContainer, ModalHeader } from "../Modal/style";
import Botao from "../Botao";
import Form from "../Form";
import Label from "../Label";
import CampoTexto from "../CampoTexto";
import { SelectGroup, SelectOption } from "../Select";
import MoneyIcon from "../Icones/MoneyIcon";
import { ITransacoes } from "../../types";

interface ModalTransacaoProps {
  transacaoParaEditar?: ITransacoes | null;
  aoSalvar: (transacao: Omit<ITransacoes, "id" | "userId">) => void;
}

export interface ModalTransacaoHandle {
  open: () => void;
  close: () => void;
}

const ModalTransacao = forwardRef<ModalTransacaoHandle, ModalTransacaoProps>(
  ({ transacaoParaEditar, aoSalvar }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [formData, setFormData] = useState({
      nome: "",
      valor: "",
      tipo: "receita" as "receita" | "despesa",
      categoria: "",
      data: "",
    });

    useEffect(() => {
      if (transacaoParaEditar) {
        setFormData({
          nome: transacaoParaEditar.nome,
          valor: transacaoParaEditar.valor.toString(),
          tipo: transacaoParaEditar.tipo,
          categoria: transacaoParaEditar.categoria,
          data: transacaoParaEditar.data,
        });
      } else {
        setFormData({
          nome: "",
          valor: "",
          tipo: "receita",
          categoria: "",
          data: "",
        });
      }
    }, [transacaoParaEditar]);

    const fechaModal = () => {
      dialogRef.current?.close();
    };

    useImperativeHandle(ref, () => ({
      open: () => dialogRef.current?.showModal(),
      close: fechaModal,
    }));

    const aoClicarForaModal = (evento: React.MouseEvent<HTMLDialogElement>) => {
      if (evento.target === dialogRef.current) {
        fechaModal();
      }
    };

    const handleSubmit = () => {
      const transacaoData = {
        ...formData,
        valor: parseFloat(formData.valor),
      };
      aoSalvar(transacaoData);
      fechaModal();
    };

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <ModalContainer ref={dialogRef} onClick={aoClicarForaModal}>
        <ModalHeader>
          <div>
            <MoneyIcon />
            {transacaoParaEditar ? "Editar Transação" : "Nova Transação"}
          </div>
          <CloseButton onClick={fechaModal}>x</CloseButton>
        </ModalHeader>
        
        <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Label htmlFor="nome">Nome da Transação</Label>
          <CampoTexto
            id="nome"
            type="text"
            value={formData.nome}
            onChange={(e) => handleInputChange("nome", e.target.value)}
            placeholder="Ex: Compra na padaria"
            required
          />

          <Label htmlFor="valor">Valor</Label>
          <CampoTexto
            id="valor"
            type="number"
            step="0.01"
            value={formData.valor}
            onChange={(e) => handleInputChange("valor", e.target.value)}
            placeholder="0,00"
            required
          />

          <Label htmlFor="tipo">Tipo</Label>
          <SelectGroup
            id="tipo"
            value={formData.tipo}
            onChange={(e) => handleInputChange("tipo", e.target.value as "receita" | "despesa")}
          >
            <SelectOption value="receita">Receita</SelectOption>
            <SelectOption value="despesa">Despesa</SelectOption>
          </SelectGroup>

          <Label htmlFor="categoria">Categoria</Label>
          <CampoTexto
            id="categoria"
            type="text"
            value={formData.categoria}
            onChange={(e) => handleInputChange("categoria", e.target.value)}
            placeholder="Ex: Alimentação"
            required
          />

          <Label htmlFor="data">Data</Label>
          <CampoTexto
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => handleInputChange("data", e.target.value)}
            required
          />
        </Form>

        <ButtonGroup>
          <Botao $variante="secundario" onClick={fechaModal}>
            Cancelar
          </Botao>
          <Botao $variante="primario" onClick={handleSubmit}>
            {transacaoParaEditar ? "Atualizar" : "Adicionar"}
          </Botao>
        </ButtonGroup>
      </ModalContainer>
    );
  }
);

export default ModalTransacao; 
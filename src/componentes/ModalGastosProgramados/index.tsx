import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { ButtonGroup, CloseButton, ModalContainer, ModalHeader } from "../Modal/style";
import Botao from "../Botao";
import Form from "../Form";
import Label from "../Label";
import CampoTexto from "../CampoTexto";
import { SelectGroup, SelectOption } from "../Select";
import MoneyIcon from "../Icones/MoneyIcon";
import { IGastoProgramado } from "../../types";

interface ModalGastosProgramadosProps {
  gastoParaEditar?: IGastoProgramado | null;
  aoSalvar: (gasto: Omit<IGastoProgramado, "id" | "userId">) => void;
}

export interface ModalGastosProgramadosHandle {
  open: () => void;
  close: () => void;
}

const ModalGastosProgramados = forwardRef<ModalGastosProgramadosHandle, ModalGastosProgramadosProps>(
  ({ gastoParaEditar, aoSalvar }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [formData, setFormData] = useState({
      nome: "",
      valor: "",
      dataVencimento: "",
      recorrencia: "mensal" as "mensal" | "quinzenal" | "semanal",
      categoria: "",
      ativo: true,
    });

    useEffect(() => {
      if (gastoParaEditar) {
        setFormData({
          nome: gastoParaEditar.nome,
          valor: gastoParaEditar.valor.toString(),
          dataVencimento: gastoParaEditar.dataVencimento,
          recorrencia: gastoParaEditar.recorrencia,
          categoria: gastoParaEditar.categoria,
          ativo: gastoParaEditar.ativo,
        });
      } else {
        setFormData({
          nome: "",
          valor: "",
          dataVencimento: "",
          recorrencia: "mensal",
          categoria: "",
          ativo: true,
        });
      }
    }, [gastoParaEditar]);

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
      const gastoData = {
        ...formData,
        valor: parseFloat(formData.valor),
      };
      aoSalvar(gastoData);
      fechaModal();
    };

    const handleInputChange = (field: string, value: string | boolean) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <ModalContainer ref={dialogRef} onClick={aoClicarForaModal}>
        <ModalHeader>
          <div>
            <MoneyIcon />
            {gastoParaEditar ? "Editar Gasto Programado" : "Novo Gasto Programado"}
          </div>
          <CloseButton onClick={fechaModal}>x</CloseButton>
        </ModalHeader>
        
        <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Label htmlFor="nome">Nome do Gasto</Label>
          <CampoTexto
            id="nome"
            type="text"
            value={formData.nome}
            onChange={(e) => handleInputChange("nome", e.target.value)}
            placeholder="Ex: Aluguel"
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

          <Label htmlFor="dataVencimento">Dia do Vencimento</Label>
          <CampoTexto
            id="dataVencimento"
            type="number"
            min="1"
            max="31"
            value={formData.dataVencimento}
            onChange={(e) => handleInputChange("dataVencimento", e.target.value)}
            placeholder="1-31"
            required
          />

          <Label htmlFor="recorrencia">Recorrência</Label>
          <SelectGroup
            id="recorrencia"
            value={formData.recorrencia}
            onChange={(e) => handleInputChange("recorrencia", e.target.value as "mensal" | "quinzenal" | "semanal")}
          >
            <SelectOption value="mensal">Mensal</SelectOption>
            <SelectOption value="quinzenal">Quinzenal</SelectOption>
            <SelectOption value="semanal">Semanal</SelectOption>
          </SelectGroup>

          <Label htmlFor="categoria">Categoria</Label>
          <CampoTexto
            id="categoria"
            type="text"
            value={formData.categoria}
            onChange={(e) => handleInputChange("categoria", e.target.value)}
            placeholder="Ex: Moradia"
            required
          />

          <Label htmlFor="ativo">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo}
              onChange={(e) => handleInputChange("ativo", e.target.checked)}
            />
            Ativo
          </Label>
        </Form>

        <ButtonGroup>
          <Botao $variante="secundario" onClick={fechaModal}>
            Cancelar
          </Botao>
          <Botao $variante="primario" onClick={handleSubmit}>
            {gastoParaEditar ? "Atualizar" : "Adicionar"}
          </Botao>
        </ButtonGroup>
      </ModalContainer>
    );
  }
);

export default ModalGastosProgramados; 
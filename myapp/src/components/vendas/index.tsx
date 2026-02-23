"use client"

import { Venda } from "@/app/models/vendas";
import { Layout } from "../layout";
import { VendasForm } from "./form";
import { useVendaService } from "@/app/services";
import { useState } from "react";
import { Alert } from "../common/message";

export const Vendas: React.FC = () => {

  const service = useVendaService()
  const [messages, setMessages] = useState<Alert[]>([])
  const [vendaRealizada, setVendaRealizada] = useState<boolean>(false)

  const handleSubmit = (venda: Venda) => {
    service.realizarVenda(venda).then(response => {
      setMessages([{texto: "Venda realizada com sucesso!", tipo: "success"}])
    })
    .catch(error => {
      setMessages([{texto: "Ocorreu um erro. Entre em contato com a administração", tipo: "error"}])
    })
  }

  const handleNovaVenda = () => {
    setVendaRealizada(false)
    setMessages([])
  }

  return (
    <Layout titulo="Venda" mensagens={messages}>
        <VendasForm onSubmit={handleSubmit} vendaRealizada={vendaRealizada} onNovaVenda={handleNovaVenda} />
    </Layout>
  );
}
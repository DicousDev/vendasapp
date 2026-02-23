"use client"

import { Layout } from "@/components/layout";
import { ClienteForm } from "./form";
import { useEffect, useState } from "react";
import { Cliente } from "@/app/models/clientes";
import { useClienteService } from "@/app/services";
import { Alert } from "@/components/common/message";
import { useRouter } from "next/router";


export const CadastroCliente: React.FC = () => {

  const clienteService = useClienteService();
  const [cliente, setCliente] = useState<Cliente>({});
  const { salvar, atualizar } = useClienteService();
  const [mensagens, setMensagens] = useState<Array<Alert>>([])
  const router = useRouter();
  const { id: queryId } = router.query;

  useEffect(() => {

    if(queryId) {
      clienteService.carregarCliente(queryId)
        .then(cliente => setCliente(cliente))
    }
  }, [queryId])

  const handleSubmit = (cliente: Cliente) => {

    if(cliente.id) {
      atualizar(cliente).then(response => setMensagens([{tipo: "success", texto: "Cliente atualizado com sucesso!"}]))
    }
    else {
      salvar(cliente).then(response => {
        setCliente(response);
        setMensagens([{tipo: "success", texto: "Cliente salvo com sucesso!"}])
      })
    }
  }

  return (
    <Layout titulo="Clientes" mensagens={mensagens}>
      <ClienteForm cliente={cliente} onSubmit={handleSubmit} />
    </Layout>
  );
}
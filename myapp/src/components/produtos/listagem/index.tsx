"use client"
import { Layout } from "@/components/layout";
import Link from "next/link";
import { TabelaProdutos } from "./tabela";
import { Produto } from "@/app/models/produtos";
import useSWR from "swr";
import { httpClient } from "@/app/http";
import { AxiosResponse } from "axios";
import { Loader } from "@/components/common";
import Router from "next/router";
import { useProdutoService } from "@/app/services";
import { Alert } from "@/components/common/message";
import { useEffect, useState } from "react";

export const ListagemProdutos: React.FC = () => {

  const produtoService = useProdutoService()
  const { data: result, error } = useSWR<AxiosResponse<Produto[]>>("/api/produtos", url => httpClient.get(url))
  const [mensagens, setMensagens] = useState<Array<Alert>>([])

  const [lista, setLista] = useState<Produto[]>([])

  useEffect(() => {
    setLista(result?.data || [])
  }, [result])

  const editar = (produto: Produto) => {
    const url = `/cadastros/produtos?id=${produto.id}`
    Router.push(url)
  }

  const deletar = (produto: Produto) => {
    produtoService.deletar(produto.id).then(response => {
      setMensagens([
        { tipo: "success", texto: "Produto excluído com sucesso!" }
      ])

      const listaAlterada: Produto[] = lista?.filter(p => p.id !== produto.id)
      setLista(listaAlterada)
    })
  }

  return (
    <Layout titulo="Produtos" mensagens={mensagens}>
      <Link legacyBehavior href="/cadastros/produtos">
        <button className="button is-warning">Novo</button>
      </Link>
      <br />
      <Loader show={!result} />
      <TabelaProdutos onEdit={editar} onDelete={deletar} produtos={lista}  />
    </Layout>
  );
}
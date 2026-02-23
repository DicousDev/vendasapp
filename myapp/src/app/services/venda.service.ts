import { httpClient } from "../http";
import { AxiosResponse } from "axios";
import { Venda } from "../models/vendas";

const resourceURL: string = "/api/vendas";

export const useVendaService = () => {
  
  const realizarVenda = async (venda: Venda): Promise<void> => {
    await httpClient.post<Venda>(`${resourceURL}`, venda)
  }

  const gerarRelatorioVendas = async (idCliente: string = '0', dataInicio: string = '', dataFim: string = ''): Promise<Blob> => {
    const url = `${resourceURL}/relatorio-vendas?id=${idCliente}&inicio=${dataInicio}&fim=${dataFim}`;
    const response: AxiosResponse = await httpClient.get(url, { responseType: 'blob' })
    const bytes = response.data;
    return new Blob([bytes], {type: "application/pdf"})
  }


  return {
    realizarVenda,
    gerarRelatorioVendas
  }
}
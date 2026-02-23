import { ItemVenda, Venda } from "@/app/models/vendas";
import { useFormik } from "formik";
import React, { use, useState } from "react";
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from "primereact/autocomplete";
import { Cliente } from "@/app/models/clientes";
import { Page } from "@/app/models/common/page";
import { useClienteService, useProdutoService } from "@/app/services";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Produto } from "@/app/models/produtos";
import { Dialog } from 'primereact/dialog'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { validationScheme } from "./validationScheme";

const formatadorMoney = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
})

interface VendasFormProps {
    onSubmit: (venda: Venda) => void;
    onNovaVenda: () => void;
    vendaRealizada: boolean;
}

const formScheme: Venda = {
    cliente: {} ,
    itens: [],
    total: 0,
    formaPagamento: ''
}

export const VendasForm: React.FC<VendasFormProps> = ({
    onSubmit,
    vendaRealizada,
    onNovaVenda
}) => {

    const formaPagamento: String[] = ["DINHEIRO", "CARTAO"]
    const clienteService = useClienteService();
    const produtoService = useProdutoService();
    const [listaProdutos, setListaProdutos] = useState<Produto[]>([])
    const [listaFiltradaProdutos, setListaFiltradaProdutos] = useState<Produto[]>([])
    const [mensagem, setMensagem] = useState<string>();
    const [codigoProduto, setCodigoProduto] = useState<string>("")
    const [quantidadeProduto, setQuantidadeProduto] = useState<number>(0);
    const [produto, setProduto] = useState<Produto>({});
    const [ listaClientes, setListaClientes ] = useState<Page<Cliente>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    })

    const formik = useFormik<Venda>({
        onSubmit,
        initialValues: formScheme,
        validationSchema: validationScheme
    })

    const handleClienteAutocomplete = (e: AutoCompleteCompleteMethodParams) => {
        const nome = e.query
        clienteService
            .find(nome, '', 0, 20)
            .then(clientes => setListaClientes(clientes))
    }

    const handleClienteChange = (e: AutoCompleteChangeParams) => {
        const clienteSelecionado: Cliente = e.value;
        formik.setFieldValue("cliente", clienteSelecionado)
    }

    const handleCodigoProdutoSelect = (event) => {

      if(codigoProduto) {
        produtoService.carregarProduto(codigoProduto)
          .then(produto => setProduto(produto))
          .catch(error => {
            setMensagem("Produto não encontrado!")
          })
      }
    }

    const handleAddProduto = () => {
      const itensAdicionados = formik.values.itens

      const jaExisteItemNaVenda = itensAdicionados?.some((iv: ItemVenda) => {
        return iv.produto.id === produto.id;
      })

      if(jaExisteItemNaVenda) {

        itensAdicionados?.forEach((iv: ItemVenda) => {
          if(iv.produto.id === produto.id) {
            iv.quantidade = iv.quantidade + quantidadeProduto;
          }
        })
      }
      else {

        itensAdicionados?.push({
          produto: produto,
          quantidade: quantidadeProduto
        });

      }

      setProduto({})
      setCodigoProduto("")
      setQuantidadeProduto(0)

      const total = totalVenda()
      formik.setFieldValue("total", total)
    }

    const handleFecharDialogProdutoNaoEncontrado = () => {
      setMensagem("")
      setCodigoProduto("")
      setProduto({})
    }

    const dialogMensagemFooter = () => {
      return (
        <div>
          <Button label="Ok" onClick={handleFecharDialogProdutoNaoEncontrado}></Button>
        </div>
      );
    }

    const disableAddProdutoButton = () => {
      return !produto || !quantidadeProduto;
    }

    const totalVenda = () => {
      const totais: number[] = formik.values.itens?.map(iv => iv.quantidade * iv.produto.preco);
      
      if(totais.length) {
        return totais.reduce((somatoriaAtual = 0, valorItemAtual) => somatoriaAtual + valorItemAtual);
      }
      else {
        return 0;
      }
    }

    const handleProdutoAutocomplete = async (e: AutoCompleteCompleteMethodParams) => {

      if(!listaProdutos.length) {
        const produtosEncontrados = await produtoService.listar()
        setListaProdutos(produtosEncontrados)
      }

      const produtosEncontrados = listaProdutos.filter((produto: Produto) => produto.nome?.toUpperCase().includes(e.query.toUpperCase()))
      setListaFiltradaProdutos(produtosEncontrados);
    }

    const realizarNovaVenda = () => {
      onNovaVenda();
      formik.resetForm();
      formik.setFieldValue("itens", [])
      formik.setFieldTouched("itens", false)
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="cliente">Cliente: *</label>
                    <AutoComplete 
                            suggestions={listaClientes.content}
                            completeMethod={handleClienteAutocomplete}
                            value={formik.values.cliente}
                            field="nome"
                            id="cliente" 
                            name="cliente" 
                            onChange={handleClienteChange}
                            />
                    <small className="p-error p-d-block">{formik.errors.cliente}</small>
                </div>   

                <div className="p-grid">
                  <div className="p-col-2">
                    <span className="p-float-label">
                      <InputText onBlur={handleCodigoProdutoSelect} id="codigoProduto" value={codigoProduto} onChange={e => setCodigoProduto(e.target.value)} />
                      <label htmlFor="codigoProduto">Código</label>
                    </span>  
                  </div>

                  <div className="p-col-6">
                    <AutoComplete onChange={e => setProduto(e.value)} completeMethod={handleProdutoAutocomplete} id="produto" name="produto" value={produto} suggestions={listaFiltradaProdutos} field="nome" />
                  </div>


                  <div className="p-col-2">
                    <span className="p-float-label">
                      <InputText id="qtdProduto" value={quantidadeProduto} onChange={e => setQuantidadeProduto(parseInt(e.target.value))} />
                      <label htmlFor="qtdProduto">QTD</label>
                    </span>  
                  </div>

                  <div className="p-col-2">
                    <Button disabled={disableAddProdutoButton()} label="Adicionar" onClick={handleAddProduto} />
                  </div>

                  <div className="p-col-12">
                    <DataTable emptyMessage="Nenhum produto adicionado." value={formik.values.itens}>
                      <Column body={(item: ItemVenda) => {

                        const handleRemoverItem = () => {
                          const novaLista = formik.values.itens?.filter(iv => iv.produto.id !== item.produto.id)
                          formik.setFieldValue("itens", novaLista)
                        }

                        return (
                          <Button type="button" label="Excluir" onClick={handleRemoverItem} />
                        )
                      }} />
                      <Column field="produto.id" header="Código" />
                      <Column field="produto.sku" header="SKU" />
                      <Column field="produto.nome" header="Produto" />
                      <Column field="produto.preco" header="Preço Unitário" />
                      <Column field="quantidade" header="QTD" />
                      <Column header="Total" body={(iv: ItemVenda) => {
                        
                        const total = iv.produto.preco * iv.quantidade
                        const totalFormatado = formatadorMoney.format(total)
                        return (
                          <div>
                            { totalFormatado }
                          </div>
                        )
                      } } />
                    </DataTable>
                    <small className="p-error p-d-block">{formik.touched && formik.errors.itens}</small>
                  </div>

                  <div className="p-col-5">
                      <div className="p-field">
                        <label htmlFor="formaPagamento">Forma de pagamento: *</label>
                        <Dropdown id="formaPagamento" options={formaPagamento} value={formik.values.formaPagamento} onChange={e => formik.setFieldValue("formaPagamento", e.value)} placeholder="Selecione..." />
                        <small className="p-error p-d-block">{formik.errors.formaPagamento}</small>
                      </div>
                  </div>

                  <div className="p-col-2">
                    <div className="p-field">
                      <label htmlFor="itens">Itens:</label>
                      <InputText disabled value={formik.values.itens?.length} />
                    </div>
                  </div>

                  <div className="p-col-2">
                    <div className="p-field">
                      <label htmlFor="total">Total:</label>
                      <InputText disabled value={formatadorMoney.format(formik.values.total)} />
                    </div>
                  </div>

                </div>
                {!vendaRealizada &&
                  <Button type="button" label="Finalizar" />
                }

                {vendaRealizada &&
                  <Button type="button" onClick={realizarNovaVenda} label="Nova Venda" className="p-button-success" />
                }
            </div>
            <Dialog header="Atenção!" position="top" 
                    visible={!!mensagem} 
                    onHide={handleFecharDialogProdutoNaoEncontrado} 
                    footer={dialogMensagemFooter}   >
              {mensagem}
            </Dialog>
        </form>
    )
}
"use client"
import { Produto } from "@/app/models/produtos";
import { useProdutoService } from "@/app/services";
import { converterEmBigDecimal, formatReal } from "@/app/util/money";
import { Input, InputMoney } from "@/components/common";
import { Alert } from "@/components/common/message";
import { Layout } from "@/components/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as yup from 'yup'


const validationSchema = yup.object().shape({
  sku: yup.string().trim().required("Campo obrigatório"),
  nome: yup.string().trim().required("Campo obrigatório"),
  descricao: yup.string().trim().required("Campo obrigatório"),
  preco: yup.number().required("Campo obrigatório").moreThan(0, "Valor deve ser maior que 0,00 (Zero)")
})

interface FormErros {
  sku?: string;
  nome?: string;
  preco?: string;
  descricao?: string;
}

export const CadastroProdutos: React.FC = () => {

  const produtoService = useProdutoService()
  const [sku, setSku] = useState<string>("")
  const [preco, setPreco] = useState<string>("0")
  const [nome, setNome] = useState<string>("")
  const [descricao, setDescricao] = useState<string>("")
  const [id, setId] = useState<string>('')
  const [cadastro, setCadastro] = useState<string>('')
  const [mensagens, setMensagens] = useState<Array<Alert>>([])
  const [errors, setErrors] = useState<FormErros>({})
  const router = useRouter();
  const { id: queryId } = router.query;

  useEffect(() => {

    if(queryId) {
      produtoService.carregarProduto(queryId)
        .then(produto => {
          setId(produto.id)
          setSku(produto.sku)
          setNome(produto.nome)
          setDescricao(produto.descricao)
          setPreco(formatReal(`${produto.preco}`))
          setCadastro(produto.cadastro)
        })
    }


  }, [queryId])

  const submit = () => {
    const produto: Produto = {
      id,
      sku,
      preco: converterEmBigDecimal(preco),
      nome,
      descricao
    }

    validationSchema.validate(produto).then(obj => {
      setErrors({})
      if(id) {
        produtoService.atualizar(produto)
          .then(response => {
            setMensagens([{
              tipo: "success", texto: "Produto atualizado com sucesso!"
            }])
          })
      }
      else {
        produtoService
          .salvar(produto)
          .then(data => {
            setId(data.id)
            setCadastro(data.cadastro)
            setMensagens([{
              tipo: "success", texto: "Produto cadastrado com sucesso!"
            }])
          })
      }
      
    }).catch(err => {
      const field = err.path;
      const message = err.message;

      setErrors({
        [field]: message
      })
    })



  }

  return (
    <Layout titulo="Produtos" mensagens={mensagens}>
      {id &&
        <div className="columns">
          <Input label="Código:" 
                id="inputId" 
                columnClasses="is-half" 
                value={id}
                disabled
              />

          <Input label="Data Cadastro:" 
                id="inputDataCadastro" 
                columnClasses="is-half" 
                value={cadastro}
                disabled
              />
        </div>
      }

      <div className="columns">
        <Input label="SKU: *" 
              id="inputSku" 
              columnClasses="is-half" 
              value={sku}
              onChange={e => setSku(e.target.value)}
              placeholder="Digite o SKU do produto"
              error={errors.sku}
              />

        <InputMoney label="Preço: *" 
              id="inputPreco" 
              columnClasses="is-half" 
              value={preco} 
              onChange={e => setPreco(e.target.value)}
              placeholder="Digite o Preço do produto" 
              maxLength={9}
              error={errors.preco}
              />
      </div>

      <div className="columns">
        <Input label="Nome: *" 
              id="inputNome" 
              columnClasses="is-full" 
              value={nome} 
              onChange={e => setNome(e.target.value)}
              placeholder="Digite o Nome do produto"
              error={errors.nome}
              />
      </div>

      <div className="columns">
        <div className="field column is-full">
          <label className="label" htmlFor="inputNome">Descrição: *</label>
          <div className="control">
            <textarea className="textarea" 
                    id="inputDesc"
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                    placeholder="Digite a Descrição detalhada do produto" />
            {errors &&
              <p className="help is-danger">{errors.descricao}</p>
            }
            
          </div>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button onClick={submit} className="button is-link">
            {id ? "Atualizar" : "Salvar"}
          </button>
        </div>
        <div className="control">
          <Link legacyBehavior href="/consultas/produtos">
            <button className="button">Voltar</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
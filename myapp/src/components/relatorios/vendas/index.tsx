"use client"

import { Cliente } from "@/app/models/clientes";
import { Page } from "@/app/models/common/page";
import { useClienteService, useVendaService } from "@/app/services";
import { Layout } from "@/components/layout";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { AutoComplete, AutoCompleteChangeParams, AutoCompleteCompleteMethodParams } from "primereact/autocomplete"
import { useState } from "react";
import { InputDate } from "@/components/common";

interface RelatorioVendasForm {
  cliente: Cliente;
  dataInicio: string;
  dataFim: string;
}

export const RelatorioVendas: React.FC = () => {

  const vendasService = useVendaService();
  const clienteService = useClienteService()
  const [listaClientes, setListaClientes] = useState<Page<Cliente>>({
    content: [],
    first: 0,
    number: 0,
    size: 20,
    totalElements: 0
  })

  const handleSubmit = (formData: RelatorioVendasForm) => {
    vendasService.gerarRelatorioVendas(formData.cliente?.id, formData.dataInicio, formData.dataFim)
    .then(blob => {
      const fileURL = URL.createObjectURL(blob)
      window.open(fileURL)
    })
  }

  const formik = useFormik<RelatorioVendasForm>({
    onSubmit: handleSubmit,
    initialValues: {
      cliente: null,
      dataFim: '',
      dataInicio: ''
    }
  })

  const handleClienteAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
    clienteService.find(e.query, '', 0, 20)
    .then(clientes => setListaClientes(clientes))
  }

  return (
    <Layout titulo="Relatório de vendas">
      <form onSubmit={formik.handleSubmit}>
        <div className="p-fluid">
          <div className="p-grid">
            <div className="p-col-12">
              <AutoComplete suggestions={listaClientes.content} completeMethod={handleClienteAutoComplete} value={formik.values.cliente} field="nome" id="cliente" name="cliente" onChange={(e: AutoCompleteChangeParams) => {formik.setFieldValue("cliente", e.value)} } />
            </div>
            <div className="p-col-6">
              <InputDate label="Data Início" id="dataInicio"  name="dataInicio" value={formik.values.dataInicio} onChange={formik.handleChange} />
            </div>
            <div className="p-col-6">
              <InputDate label="Data Fim" id="dataFim"  name="dataFim" value={formik.values.dataFim} onChange={formik.handleChange} />
            </div>
            <div className="p-col">
              <Button label="Gerar relatório" type="submit" />
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
}
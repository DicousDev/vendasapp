import { Cliente } from "@/app/models/clientes";
import { Input, InputCPF, InputDate, InputTelefone } from "@/components/common";
import { useFormik } from "formik"
import Link from "next/link";
import * as Yup from 'yup';

interface ClienteFormProps {
  cliente: Cliente;
  onSubmit: (cliente: Cliente) => void;
}

const formScheme: Cliente = {
  cadastro: '',
  cpf: '',
  dataNascimento: '',
  email: '',
  endereco: '',
  id: '',
  nome: '',
  telefone: ''
}

const campoObrigatorio = "Campo obrigatório";
const campoObrigatorioValidation = Yup.string().trim().required(campoObrigatorio);

const validationScheme = Yup.object().shape({
  cpf: Yup.string().trim().required(campoObrigatorio).length(14, "CPF inválido"),
  dataNascimento: Yup.string().trim().required(campoObrigatorio).length(10, "Data inválida"),
  email: Yup.string().trim().required(campoObrigatorio).email("Email inválido"),
  endereco: Yup.string().trim().required(campoObrigatorio),
  nome: campoObrigatorioValidation,
  telefone: campoObrigatorioValidation
})

export const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onSubmit }: ClienteFormProps) => {
  
  const formik = useFormik<Cliente>({
    initialValues: { ...formScheme, ...cliente },
    onSubmit,
    enableReinitialize: true,
    validationSchema: validationScheme
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.values.id &&
        <div className="columns">

          <Input id="id" name="id" label="Código: " disabled autoComplete="off" columnClasses="is-half" value={formik.values.id} />
          <Input id="cadastro" name="cadastro" label="Data Cadastro:" disabled autoComplete="off" columnClasses="is-half" value={formik.values.cadastro} />
        </div>
      }
      <div className="columns">
        <Input error={formik.errors.nome} id="nome" name="nome" label="Nome: *" autoComplete="off" columnClasses="is-full" onChange={formik.handleChange} value={formik.values.nome} />
      </div>
      <div className="columns">
        <InputCPF error={formik.errors.cpf} id="cpf" name="cpf" label="CPF: *" autoComplete="off" columnClasses="is-half" onChange={formik.handleChange} value={formik.values.cpf} />
        <InputDate error={formik.errors.dataNascimento} id="dataNascimento" name="dataNascimento" label="Data Nascimento: *" autoComplete="off" columnClasses="is-half" onChange={formik.handleChange} value={formik.values.dataNascimento} />
      </div>
      <div className="columns">
        <Input error={formik.errors.endereco} id="endereco" name="endereco" label="Endereço: *" autoComplete="off" columnClasses="is-full" onChange={formik.handleChange} value={formik.values.endereco} />
      </div>
      <div className="columns">
        <Input error={formik.errors.email} id="email" name="email" label="Email: *" autoComplete="off" columnClasses="is-half" onChange={formik.handleChange} value={formik.values.email} />
        <InputTelefone error={formik.errors.telefone} id="telefone" name="telefone" label="Telefone: *" autoComplete="off" columnClasses="is-half" onChange={formik.handleChange} value={formik.values.telefone} />
      </div>
      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link">
            {formik.values.id ? "Atualizar" : "Salvar"}
          </button>
        </div>
        <div className="control">
          <Link legacyBehavior href="/consultas/clientes">
            <button className="button">Voltar</button>
          </Link>
        </div>
      </div>
    </form>
  );
}
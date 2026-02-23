package io.github.dicousdev.vendas.rest.clientes;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@EqualsAndHashCode
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ClienteFormRequest {

    private Long id;
    private String nome;
    private String cpf;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataNascimento;
    private String endereco;
    private String email;
    private String telefone;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate cadastro;

}

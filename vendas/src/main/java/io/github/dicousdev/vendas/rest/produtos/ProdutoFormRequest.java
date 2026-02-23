package io.github.dicousdev.vendas.rest.produtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;

@EqualsAndHashCode
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ProdutoFormRequest {

    private Long id;
    private String descricao;
    private String nome;
    private BigDecimal preco;
    private String sku;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate cadastro;
}

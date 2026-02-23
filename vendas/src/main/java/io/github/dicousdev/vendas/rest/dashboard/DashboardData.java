package io.github.dicousdev.vendas.rest.dashboard;

import io.github.dicousdev.vendas.repository.projections.VendaPorMes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@EqualsAndHashCode
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class DashboardData {

    private Long produtos;
    private Long clientes;
    private Long vendas;
    private List<VendaPorMes> vendasPorMes;

    public void preencherMesesFaltantes() {
        Integer mesMaximo =  getVendasPorMes()
                .stream()
                .mapToInt(VendaPorMes::getMes)
                .max().getAsInt();
        List<Integer> listaMeses = IntStream
                .rangeClosed(1, mesMaximo)
                .boxed().collect(Collectors.toList());

        List<Integer> mesesAdicionados = getVendasPorMes()
                .stream()
                .map(VendaPorMes::getMes)
                .collect(Collectors.toList());

        listaMeses.stream().forEach(mes -> {
            if(!mesesAdicionados.contains(mes)) {
                VendaPorMes vendaPorMes = new VendaPorMes() {

                    @Override
                    public BigDecimal getValor() {
                        return BigDecimal.ZERO;
                    }

                    @Override
                    public Integer getMes() {
                        return mes;
                    }
                };

                getVendasPorMes().add(vendaPorMes);
            }
        });

        getVendasPorMes().sort( Comparator.comparing(VendaPorMes::getMes) );
    }
}

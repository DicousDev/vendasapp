package io.github.dicousdev.vendas.repository.projections;

import java.math.BigDecimal;

public interface VendaPorMes {
    Integer getMes();
    BigDecimal getValor();
}

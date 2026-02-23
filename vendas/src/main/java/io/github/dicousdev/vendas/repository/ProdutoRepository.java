package io.github.dicousdev.vendas.repository;

import io.github.dicousdev.vendas.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

}

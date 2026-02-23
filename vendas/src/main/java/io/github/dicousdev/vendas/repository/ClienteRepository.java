package io.github.dicousdev.vendas.repository;

import io.github.dicousdev.vendas.model.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Query(value = "select c from Cliente c where upper(c.nome) like :nome or c.cpf like :cpf")
    Page<Cliente> buscarPorNomeCpf(@Param("nome") String nome, @Param("cpf") String cpf, Pageable pageable);
}

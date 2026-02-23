package io.github.dicousdev.vendas.service;

import io.github.dicousdev.vendas.model.Produto;
import io.github.dicousdev.vendas.repository.ProdutoRepository;
import io.github.dicousdev.vendas.rest.produtos.ProdutoFormRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProdutoService {

    private final ProdutoRepository repository;

    @Transactional
    public Produto registrar(ProdutoFormRequest request) {
        log.info("Registrando produto");
        return repository.save(Produto.builder()
                        .nome(request.getNome())
                        .sku(request.getSku())
                        .preco(request.getPreco())
                        .descricao(request.getDescricao())
                        .dataCadastro(LocalDate.now())
                .build());
    }
}

package io.github.dicousdev.vendas.rest.produtos;

import io.github.dicousdev.vendas.model.Produto;
import io.github.dicousdev.vendas.repository.ProdutoRepository;
import io.github.dicousdev.vendas.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin("*")
public class ProdutoController {

    private final ProdutoService produtoService;
    private final ProdutoRepository repository;

    @GetMapping
    @Transactional(readOnly = true)
    public List<ProdutoFormRequest> getLista() {
        return repository.findAll().stream().map(produto -> ProdutoFormRequest.builder()
                .id(produto.getId())
                .nome(produto.getNome())
                .preco(produto.getPreco())
                .sku(produto.getSku())
                .cadastro(produto.getDataCadastro())
                .descricao(produto.getDescricao())
                .build())
                .toList();
    }

    @GetMapping("{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<ProdutoFormRequest> getById(@PathVariable("id") Long produtoId) {

        Optional<Produto> produto = repository.findById(produtoId);
        if(produto.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(ProdutoFormRequest.builder()
                .id(produto.get().getId())
                .nome(produto.get().getNome())
                .preco(produto.get().getPreco())
                .sku(produto.get().getSku())
                .cadastro(produto.get().getDataCadastro())
                .descricao(produto.get().getDescricao())
                .build());
    }

    @PostMapping
    @Transactional
    public ProdutoFormRequest salvar(@RequestBody @Valid ProdutoFormRequest request) {
        Produto produto = produtoService.registrar(request);
        return ProdutoFormRequest.builder()
                .id(produto.getId())
                .nome(produto.getNome())
                .preco(produto.getPreco())
                .sku(produto.getSku())
                .cadastro(produto.getDataCadastro())
                .descricao(produto.getDescricao())
                .build();
    }

    @PutMapping("{id}")
    @Transactional
    public ResponseEntity<Void> atualizar(@PathVariable("id") Long produtoId, @RequestBody ProdutoFormRequest request) {
        log.info("Atualizando dados do produto. [Produto ID {}]", produtoId);
        Optional<Produto> produto = repository.findById(produtoId);
        if(produto.isEmpty()) {
            log.info("Produto não encontrado. [Produto ID {}]", produtoId);
            return ResponseEntity.notFound().build();
        }


        repository.save(Produto.builder()
                .id(produtoId)
                .nome(request.getNome())
                .sku(request.getSku())
                .preco(request.getPreco())
                .descricao(request.getDescricao())
                .build());

        log.info("Produto atualizado com sucesso. [Produto ID {}]", produtoId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{id}")
    @Transactional
    public ResponseEntity<Void> atualizar(@PathVariable("id") Long produtoId) {
        log.info("Deletando produto. [Produto ID {}]", produtoId);
        Optional<Produto> produto = repository.findById(produtoId);
        if(produto.isEmpty()) {
            log.info("Produto não encontrado. [Produto ID {}]", produtoId);
            return ResponseEntity.notFound().build();
        }


        repository.deleteById(produtoId);
        log.info("Produto deletado com sucesso. [Produto ID {}]", produtoId);
        return ResponseEntity.noContent().build();
    }


}

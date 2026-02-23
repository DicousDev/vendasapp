package io.github.dicousdev.vendas.rest.clientes;

import io.github.dicousdev.vendas.model.Cliente;
import io.github.dicousdev.vendas.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin("*")
public class ClienteController {

    private final ClienteRepository repository;

    @PostMapping
    public ResponseEntity<ClienteFormRequest> salvar(@RequestBody ClienteFormRequest request) {
        Cliente cliente = toModel(request)
                .dataCadastro(LocalDate.now())
                .build();

        return ResponseEntity.ok(fromModel(repository.save(cliente)));
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> atualizar(@PathVariable("id") Long clienteId, @RequestBody ClienteFormRequest request) {

        Optional<Cliente> clienteOp = repository.findById(clienteId);
        if(clienteOp.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        repository.save(toModel(request)
                .id(clienteId)
                .build());

        return ResponseEntity.ok().build();
    }

    @GetMapping("{id}")
    public ResponseEntity<ClienteFormRequest> getById(@PathVariable("id") Long clienteId) {
        return repository.findById(clienteId).map(this::fromModel)
                .map(response -> ResponseEntity.ok(response))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteById(@PathVariable("id") Long clienteId) {

        Optional<Cliente> clienteOp = repository.findById(clienteId);
        if(clienteOp.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(clienteId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public Page<ClienteFormRequest> getLista(@RequestParam(value = "nome", required = false, defaultValue = "") String nome, @RequestParam(value = "cpf", required = false, defaultValue = "") String cpf, Pageable pageable) {
        return repository.buscarPorNomeCpf("%" + nome + "%", "%" + cpf + "%", pageable).map(this::fromModel);
    }

    public Cliente.ClienteBuilder toModel(ClienteFormRequest cliente) {
        return Cliente.builder()
                .id(cliente.getId())
                .nome(cliente.getNome())
                .cpf(cliente.getCpf())
                .endereco(cliente.getEndereco())
                .telefone(cliente.getTelefone())
                .dataCadastro(cliente.getCadastro())
                .nascimento(cliente.getDataNascimento())
                .email(cliente.getEmail());
    }

    public ClienteFormRequest fromModel(Cliente cliente) {
        return ClienteFormRequest.builder()
                .id(cliente.getId())
                .nome(cliente.getNome())
                .cpf(cliente.getCpf())
                .endereco(cliente.getEndereco())
                .telefone(cliente.getTelefone())
                .cadastro(cliente.getDataCadastro())
                .dataNascimento(cliente.getNascimento())
                .email(cliente.getEmail())
                .build();
    }
}

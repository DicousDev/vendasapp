package io.github.dicousdev.vendas.rest.dashboard;

import io.github.dicousdev.vendas.repository.ClienteRepository;
import io.github.dicousdev.vendas.repository.ProdutoRepository;
import io.github.dicousdev.vendas.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DashboardController {

    private final VendaRepository vendaRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    @GetMapping
    public DashboardData getDashboard() {
        long vendasCount = vendaRepository.count();
        long clientesCount = clienteRepository.count();
        long produtosCount = produtoRepository.count();

        var anoCorrente = LocalDate.now().getYear();
        var vendasPorMes = vendaRepository.obterSomatoriaVendasPorMes(anoCorrente);

        var obj = new DashboardData(produtosCount, clientesCount, vendasCount, vendasPorMes);
        obj.preencherMesesFaltantes();
        return obj;
    }
}

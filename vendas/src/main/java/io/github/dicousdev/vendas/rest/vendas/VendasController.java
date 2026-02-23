package io.github.dicousdev.vendas.rest.vendas;

import io.github.dicousdev.vendas.model.Venda;
import io.github.dicousdev.vendas.repository.ItemVendaRepository;
import io.github.dicousdev.vendas.repository.VendaRepository;
import io.github.dicousdev.vendas.service.RelatorioVendasService;
import io.github.dicousdev.vendas.util.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin("*")
@RequiredArgsConstructor
public class VendasController {

    private final VendaRepository repository;
    private final ItemVendaRepository itemVendaRepository;
    private final RelatorioVendasService relatorioVendasService;

    @PostMapping
    @Transactional
    public void realizarVenda(@RequestBody Venda request) {
        repository.save(request);
        request.getItens().stream().forEach(iv -> iv.setVenda(request));
        itemVendaRepository.saveAll(request.getItens());
    }

    @GetMapping("/relatorio-vendas")
    public ResponseEntity<byte[]> relatorioVendas(@RequestParam(value = "id", required = false, defaultValue = "") Long id,
                                                  @RequestParam(value = "inicio", required = false, defaultValue = "") String inicio,
                                                  @RequestParam(value = "fim", required = false, defaultValue = "") String fim) {
        Date dataInicio = DateUtils.fromString(inicio, false);
        Date dataFim = DateUtils.fromString(fim, true);

        if(dataInicio == null) {
            dataInicio = DateUtils.fromString("01/01/1970", false);
        }

        if(dataFim == null) {
            dataInicio = DateUtils.hoje(true);
        }

        byte[] relatorioGerado = relatorioVendasService.gerarRelatorio(id, dataInicio, dataFim);

        HttpHeaders headers = new HttpHeaders();
        String fileName = "relatorio-vendas.pdf";

        headers.setContentDispositionFormData("inline; filename=\"" + fileName + "\"", fileName);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        var responseEntity = new ResponseEntity<>(relatorioGerado, headers, HttpStatus.OK);
        return responseEntity;
    }
}

package io.github.dicousdev.vendas.service;

import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RelatorioVendasService {

    @Value("classpath:reports/relatorioVenda.jrxml")
    private Resource relatorioVendas;

    private final DataSource dataSource;

    public byte[] gerarRelatorio(Long idCliente, Date dataInicio, Date dataFim) {

        try(Connection connection = dataSource.getConnection()) {
            JasperReport compiledReport = JasperCompileManager.compileReport(relatorioVendas.getInputStream());
            Map<String, Object> parametros = new HashMap<>();
            parametros.put("CLIENTE_ID", idCliente);
            parametros.put("DATA_INICIO", dataInicio);
            parametros.put("DATA_FIM", dataFim);
            JasperPrint print = JasperFillManager.fillReport(compiledReport, parametros, connection);
            return JasperExportManager.exportReportToPdf(print);
        }
        catch (SQLException ex) {
            ex.printStackTrace();
        } catch (JRException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new byte[0];
    }
}

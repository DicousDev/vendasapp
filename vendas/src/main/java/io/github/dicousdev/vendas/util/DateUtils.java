package io.github.dicousdev.vendas.util;

import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateUtils {

    public static Date hoje(boolean atEndOfDay) {
        String s = LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        return fromString(s, atEndOfDay);
    }

    public static Date fromString(String dataString, boolean atEndOfDay) {

        if(!StringUtils.hasText(dataString)) {
            return null;
        }

        var data = LocalDate.parse(dataString, DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        LocalDateTime dataHora;
        if(atEndOfDay) {
            dataHora = data.atTime(LocalTime.of(23, 59));
        }
        else {
            dataHora = data.atStartOfDay();
        }

        Instant instant = dataHora.atZone(ZoneId.systemDefault()).toInstant();
        return Date.from(instant);
    }
}

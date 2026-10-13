package com.legado.testtecnico.shared.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;
import java.time.ZoneId;

@Configuration
public class ClockConfig {

    // "Hoje" é o dia no Brasil, mesmo com o servidor em UTC: perto da meia-noite os dois divergem.
    private static final ZoneId FUSO_BRASILIA = ZoneId.of("America/Sao_Paulo");

    @Bean
    public Clock clock() {
        return Clock.system(FUSO_BRASILIA);
    }
}

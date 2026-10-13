package com.legado.testtecnico.shared.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openApi() {
        return new OpenAPI().info(new Info()
                .title("Agendamento de Transferências")
                .description("Agenda transferências financeiras, calcula a taxa pela data e lista o extrato.")
                .version("1.0.0"));
    }
}

package com.legado.testtecnico.transferencia;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Clock;
import java.time.LocalDate;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Fluxo completo com o contexto real: validação, regra de taxa, H2 e handler de erros.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AgendamentoIntegracaoTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private Clock clock;

    @Test
    void deveAgendarComATaxaDoServidorEMostrarNoExtrato() throws Exception {
        LocalDate hoje = LocalDate.now(clock);

        mockMvc.perform(post("/api/transferencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo("0001234567", "0007654321", "1000.00", hoje.plusDays(15))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.taxa").value(82.00))
                .andExpect(jsonPath("$.total").value(1082.00))
                .andExpect(jsonPath("$.dataAgendamento").value(hoje.toString()));

        mockMvc.perform(get("/api/transferencias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].taxa", hasItem(82.00)));
    }

    @Test
    void deveRecusarDataAlemDeCinquentaDiasSemGravar() throws Exception {
        LocalDate hoje = LocalDate.now(clock);

        mockMvc.perform(post("/api/transferencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo("0001234567", "0007654321", "1000.00", hoje.plusDays(51))))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.mensagem").value("Erro: não há taxa aplicável para a data informada."));
    }

    private static String corpo(String contaOrigem, String contaDestino, String valor, LocalDate data) {
        return String.format(
                "{\"contaOrigem\":\"%s\",\"contaDestino\":\"%s\",\"valor\":%s,\"dataTransferencia\":\"%s\"}",
                contaOrigem, contaDestino, valor, data);
    }
}

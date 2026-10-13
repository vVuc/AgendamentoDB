package com.legado.testtecnico.transferencia.api;

import com.legado.testtecnico.transferencia.domain.Transferencia;
import com.legado.testtecnico.transferencia.service.TransferenciaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TransferenciaController.class)
class TransferenciaControllerTest {

    private static final LocalDate HOJE = LocalDate.of(2026, 10, 13);
    private static final LocalDate DATA_TRANSFERENCIA = LocalDate.of(2026, 10, 20);

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransferenciaService service;

    @Test
    void deveAgendarEDevolver201ComLocation() throws Exception {
        when(service.agendar(eq("0001234567"), eq("0007654321"), any(BigDecimal.class), eq(DATA_TRANSFERENCIA)))
                .thenReturn(transferenciaGravada(1L));

        mockMvc.perform(post("/api/transferencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo("0001234567", "0007654321", "1000.00", "2026-10-20")))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/transferencias/1"))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.taxa").value(12.00))
                .andExpect(jsonPath("$.total").value(1012.00))
                .andExpect(jsonPath("$.dataTransferencia").value("2026-10-20"))
                .andExpect(jsonPath("$.dataAgendamento").value("2026-10-13"));
    }

    @Test
    void deveListarOExtrato() throws Exception {
        when(service.listarExtrato()).thenReturn(List.of(transferenciaGravada(2L), transferenciaGravada(1L)));

        mockMvc.perform(get("/api/transferencias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(2))
                .andExpect(jsonPath("$[0].contaOrigem").value("0001234567"));
    }

    @Test
    void deveBuscarUmaTransferenciaPeloId() throws Exception {
        when(service.buscarPorId(1L)).thenReturn(transferenciaGravada(1L));

        mockMvc.perform(get("/api/transferencias/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    static String corpo(String contaOrigem, String contaDestino, String valor, String dataTransferencia) {
        return String.format(
                "{\"contaOrigem\":\"%s\",\"contaDestino\":\"%s\",\"valor\":%s,\"dataTransferencia\":\"%s\"}",
                contaOrigem, contaDestino, valor, dataTransferencia);
    }

    private static Transferencia transferenciaGravada(Long id) {
        Transferencia transferencia = Transferencia.builder()
                .contaOrigem("0001234567")
                .contaDestino("0007654321")
                .valor(new BigDecimal("1000.00"))
                .taxa(new BigDecimal("12.00"))
                .dataTransferencia(DATA_TRANSFERENCIA)
                .dataAgendamento(HOJE)
                .build();
        ReflectionTestUtils.setField(transferencia, "id", id);
        return transferencia;
    }
}

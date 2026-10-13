package com.legado.testtecnico.transferencia.api;

import com.legado.testtecnico.shared.error.ContasIguaisException;
import com.legado.testtecnico.shared.error.TaxaNaoAplicavelException;
import com.legado.testtecnico.shared.error.TransferenciaNaoEncontradaException;
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

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verifyNoInteractions;
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

    @Test
    void deveRecusarContaComNoveDigitosSemChamarOServico() throws Exception {
        mockMvc.perform(post("/api/transferencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo("123456789", "0007654321", "1000.00", "2026-10-20")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem").value("Erro: dados inválidos."))
                .andExpect(jsonPath("$.campos.contaOrigem").value("Erro: a conta de origem deve ter 10 dígitos."));

        verifyNoInteractions(service);
    }

    @Test
    void deveRecusarValorZero() throws Exception {
        mockMvc.perform(post("/api/transferencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo("0001234567", "0007654321", "0", "2026-10-20")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.valor").value("Erro: o valor deve ser maior que zero."));
    }

    @Test
    void deveApontarTodosOsCamposAusentes() throws Exception {
        mockMvc.perform(post("/api/transferencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.contaOrigem").exists())
                .andExpect(jsonPath("$.campos.contaDestino").exists())
                .andExpect(jsonPath("$.campos.valor").exists())
                .andExpect(jsonPath("$.campos.dataTransferencia").exists());
    }

    @Test
    void deveRecusarJsonMalformado() throws Exception {
        mockMvc.perform(post("/api/transferencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"contaOrigem\":"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem", startsWith("Erro:")))
                .andExpect(jsonPath("$.campos").doesNotExist());
    }

    @Test
    void deveRecusarDataForaDoFormatoIso() throws Exception {
        mockMvc.perform(post("/api/transferencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo("0001234567", "0007654321", "1000.00", "20/10/2026")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem", containsString("aaaa-mm-dd")));
    }

    @Test
    void deveResponder422ComOCampoQuandoAsContasSaoIguais() throws Exception {
        when(service.agendar(anyString(), anyString(), any(BigDecimal.class), any(LocalDate.class)))
                .thenThrow(new ContasIguaisException());

        mockMvc.perform(post("/api/transferencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo("0001234567", "0001234567", "1000.00", "2026-10-20")))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.mensagem")
                        .value("Erro: a conta de destino deve ser diferente da conta de origem."))
                .andExpect(jsonPath("$.campos.contaDestino").exists());
    }

    @Test
    void deveResponder422QuandoNaoHaTaxaParaAData() throws Exception {
        when(service.agendar(anyString(), anyString(), any(BigDecimal.class), any(LocalDate.class)))
                .thenThrow(new TaxaNaoAplicavelException());

        mockMvc.perform(post("/api/transferencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo("0001234567", "0007654321", "1000.00", "2027-01-30")))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.mensagem").value("Erro: não há taxa aplicável para a data informada."))
                .andExpect(jsonPath("$.campos").doesNotExist());
    }

    @Test
    void deveResponder404QuandoATransferenciaNaoExiste() throws Exception {
        when(service.buscarPorId(99L)).thenThrow(new TransferenciaNaoEncontradaException(99L));

        mockMvc.perform(get("/api/transferencias/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensagem", startsWith("Erro:")));
    }

    @Test
    void deveEsconderOsDetalhesDeUmaFalhaInesperada() throws Exception {
        when(service.listarExtrato()).thenThrow(new IllegalStateException("detalhe interno do banco"));

        mockMvc.perform(get("/api/transferencias"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.mensagem", startsWith("Erro:")))
                .andExpect(jsonPath("$.mensagem", not(containsString("banco"))));
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

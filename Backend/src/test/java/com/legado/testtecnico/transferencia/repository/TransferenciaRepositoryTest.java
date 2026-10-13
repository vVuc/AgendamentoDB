package com.legado.testtecnico.transferencia.repository;

import com.legado.testtecnico.transferencia.domain.Transferencia;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class TransferenciaRepositoryTest {

    @Autowired
    private TransferenciaRepository repository;

    @Test
    void deveListarOExtratoDoAgendamentoMaisRecenteParaOMaisAntigo() {
        Long antiga = repository.save(agendadaEm(LocalDate.of(2026, 10, 1))).getId();
        Long deHoje = repository.save(agendadaEm(LocalDate.of(2026, 10, 13))).getId();
        Long deHojeMaisTarde = repository.save(agendadaEm(LocalDate.of(2026, 10, 13))).getId();

        assertThat(repository.findAllByOrderByDataAgendamentoDescIdDesc())
                .extracting(Transferencia::getId)
                .containsExactly(deHojeMaisTarde, deHoje, antiga);
    }

    private static Transferencia agendadaEm(LocalDate dataAgendamento) {
        return Transferencia.builder()
                .contaOrigem("0001234567")
                .contaDestino("0007654321")
                .valor(new BigDecimal("100.00"))
                .taxa(new BigDecimal("12.00"))
                .dataTransferencia(dataAgendamento.plusDays(5))
                .dataAgendamento(dataAgendamento)
                .build();
    }
}

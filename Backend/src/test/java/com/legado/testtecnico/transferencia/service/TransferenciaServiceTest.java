package com.legado.testtecnico.transferencia.service;

import com.legado.testtecnico.shared.error.ContasIguaisException;
import com.legado.testtecnico.shared.error.TaxaNaoAplicavelException;
import com.legado.testtecnico.shared.error.TransferenciaNaoEncontradaException;
import com.legado.testtecnico.transferencia.domain.Transferencia;
import com.legado.testtecnico.transferencia.repository.TransferenciaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransferenciaServiceTest {

    private static final ZoneId FUSO_BRASILIA = ZoneId.of("America/Sao_Paulo");
    private static final LocalDate HOJE = LocalDate.of(2026, 10, 13);
    private static final String CONTA_ORIGEM = "0001234567";
    private static final String CONTA_DESTINO = "0007654321";
    private static final BigDecimal MIL_REAIS = new BigDecimal("1000.00");

    @Mock
    private TransferenciaRepository repository;

    private TransferenciaService service;

    @BeforeEach
    void setUp() {
        Clock relogio = Clock.fixed(HOJE.atTime(10, 0).atZone(FUSO_BRASILIA).toInstant(), FUSO_BRASILIA);
        service = new TransferenciaService(repository, new CalculadoraTaxa(), relogio);
    }

    @Test
    void deveGravarComATaxaCalculadaEADataDeHoje() {
        when(repository.save(any(Transferencia.class))).thenAnswer(invocacao -> invocacao.getArgument(0));

        Transferencia transferencia = service.agendar(CONTA_ORIGEM, CONTA_DESTINO, MIL_REAIS, HOJE.plusDays(7));

        assertThat(transferencia.getTaxa()).isEqualByComparingTo("12.00");
        assertThat(transferencia.getTotal()).isEqualByComparingTo("1012.00");
        assertThat(transferencia.getDataAgendamento()).isEqualTo(HOJE);
        assertThat(transferencia.getDataTransferencia()).isEqualTo(HOJE.plusDays(7));
        verify(repository).save(transferencia);
    }

    @Test
    void deveContarOsDiasPeloCalendarioDoBrasilPertoDaMeiaNoite() {
        Instant onzeEMeiaDaNoiteEmBrasilia = Instant.parse("2026-10-14T02:30:00Z");
        service = new TransferenciaService(repository, new CalculadoraTaxa(),
                Clock.fixed(onzeEMeiaDaNoiteEmBrasilia, FUSO_BRASILIA));
        when(repository.save(any(Transferencia.class))).thenAnswer(invocacao -> invocacao.getArgument(0));

        Transferencia transferencia = service.agendar(CONTA_ORIGEM, CONTA_DESTINO, MIL_REAIS, HOJE);

        assertThat(transferencia.getDataAgendamento()).isEqualTo(HOJE);
        assertThat(transferencia.getTaxa()).isEqualByComparingTo("28.00");
    }

    @Test
    void naoDeveGravarQuandoADataEstaNoPassado() {
        assertThatThrownBy(() -> service.agendar(CONTA_ORIGEM, CONTA_DESTINO, MIL_REAIS, HOJE.minusDays(1)))
                .isInstanceOf(TaxaNaoAplicavelException.class);

        verifyNoInteractions(repository);
    }

    @Test
    void naoDeveGravarQuandoAsContasSaoIguais() {
        assertThatThrownBy(() -> service.agendar(CONTA_ORIGEM, CONTA_ORIGEM, MIL_REAIS, HOJE))
                .isInstanceOf(ContasIguaisException.class)
                .satisfies(erro -> assertThat(((ContasIguaisException) erro).getCampo()).contains("contaDestino"));

        verifyNoInteractions(repository);
    }

    @Test
    void deveFalharAoBuscarTransferenciaInexistente() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarPorId(99L))
                .isInstanceOf(TransferenciaNaoEncontradaException.class)
                .hasMessageStartingWith("Erro:");
    }
}

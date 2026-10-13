package com.legado.testtecnico.transferencia.api.dto;

import com.legado.testtecnico.transferencia.domain.Transferencia;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class TransferenciaResponse {

    private final Long id;
    private final String contaOrigem;
    private final String contaDestino;
    private final BigDecimal valor;
    private final BigDecimal taxa;
    private final BigDecimal total;
    private final LocalDate dataTransferencia;
    private final LocalDate dataAgendamento;

    public static TransferenciaResponse de(Transferencia transferencia) {
        return new TransferenciaResponse(
                transferencia.getId(),
                transferencia.getContaOrigem(),
                transferencia.getContaDestino(),
                transferencia.getValor(),
                transferencia.getTaxa(),
                transferencia.getTotal(),
                transferencia.getDataTransferencia(),
                transferencia.getDataAgendamento());
    }
}

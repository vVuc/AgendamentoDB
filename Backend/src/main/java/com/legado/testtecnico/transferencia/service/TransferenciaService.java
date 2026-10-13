package com.legado.testtecnico.transferencia.service;

import com.legado.testtecnico.shared.error.ContasIguaisException;
import com.legado.testtecnico.shared.error.TransferenciaNaoEncontradaException;
import com.legado.testtecnico.transferencia.domain.Transferencia;
import com.legado.testtecnico.transferencia.repository.TransferenciaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransferenciaService {

    private final TransferenciaRepository repository;
    private final CalculadoraTaxa calculadoraTaxa;
    private final Clock clock;

    @Transactional
    public Transferencia agendar(String contaOrigem, String contaDestino, BigDecimal valor,
                                 LocalDate dataTransferencia) {
        if (contaOrigem.equals(contaDestino)) {
            throw new ContasIguaisException();
        }

        LocalDate hoje = LocalDate.now(clock);
        long dias = ChronoUnit.DAYS.between(hoje, dataTransferencia);
        BigDecimal taxa = calculadoraTaxa.calcular(dias, valor);

        Transferencia transferencia = repository.save(Transferencia.builder()
                .contaOrigem(contaOrigem)
                .contaDestino(contaDestino)
                .valor(valor)
                .taxa(taxa)
                .dataTransferencia(dataTransferencia)
                .dataAgendamento(hoje)
                .build());

        log.info("Transferência {} agendada para {} com taxa {}", transferencia.getId(), dataTransferencia, taxa);
        return transferencia;
    }

    @Transactional(readOnly = true)
    public Transferencia buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new TransferenciaNaoEncontradaException(id));
    }

    @Transactional(readOnly = true)
    public List<Transferencia> listarExtrato() {
        return repository.findAllByOrderByDataAgendamentoDescIdDesc();
    }
}

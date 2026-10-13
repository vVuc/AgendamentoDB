package com.legado.testtecnico.transferencia.repository;

import com.legado.testtecnico.transferencia.domain.Transferencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransferenciaRepository extends JpaRepository<Transferencia, Long> {

    List<Transferencia> findAllByOrderByDataAgendamentoDescIdDesc();
}

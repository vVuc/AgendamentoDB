package com.legado.testtecnico.transferencia.service;

import com.legado.testtecnico.shared.error.TaxaNaoAplicavelException;
import com.legado.testtecnico.transferencia.domain.FaixaTaxa;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class CalculadoraTaxa {

    private static final BigDecimal CEM = BigDecimal.valueOf(100);
    private static final int CASAS_DECIMAIS = 2;

    /**
     * Calcula a taxa sobre o valor a transferir: fixa + valor × percentual.
     *
     * @throws TaxaNaoAplicavelException quando nenhuma faixa cobre os dias informados
     */
    public BigDecimal calcular(long dias, BigDecimal valor) {
        FaixaTaxa faixa = FaixaTaxa.paraDias(dias).orElseThrow(TaxaNaoAplicavelException::new);
        BigDecimal parteVariavel = valor.multiply(faixa.getPercentual()).divide(CEM);
        return faixa.getTaxaFixa()
                .add(parteVariavel)
                .setScale(CASAS_DECIMAIS, RoundingMode.HALF_EVEN);
    }
}

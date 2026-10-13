package com.legado.testtecnico.transferencia.service;

import com.legado.testtecnico.shared.error.TaxaNaoAplicavelException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CalculadoraTaxaTest {

    private static final BigDecimal MIL_REAIS = new BigDecimal("1000.00");

    private final CalculadoraTaxa calculadora = new CalculadoraTaxa();

    @ParameterizedTest(name = "{0} dias sobre R$ 1.000,00 cobra R$ {1}")
    @CsvSource({
            "0, 28.00",
            "1, 12.00",
            "10, 12.00",
            "11, 82.00",
            "20, 82.00",
            "21, 69.00",
            "30, 69.00",
            "31, 47.00",
            "40, 47.00",
            "41, 17.00",
            "50, 17.00"
    })
    void deveCobrarATaxaDaFaixaNasBordas(long dias, BigDecimal taxaEsperada) {
        assertThat(calculadora.calcular(dias, MIL_REAIS)).isEqualByComparingTo(taxaEsperada);
    }

    @ParameterizedTest(name = "{0} dias não tem faixa")
    @ValueSource(longs = {-1, 51})
    void deveRecusarQuandoNenhumaFaixaCobreOsDias(long dias) {
        assertThatThrownBy(() -> calculadora.calcular(dias, MIL_REAIS))
                .isInstanceOf(TaxaNaoAplicavelException.class)
                .hasMessageStartingWith("Erro:");
    }

    @ParameterizedTest(name = "R$ {0} no mesmo dia cobra R$ {1}")
    @CsvSource({
            "0.20, 3.00",
            "0.60, 3.02"
    })
    void deveArredondarMeioCentavoParaOParMaisProximo(BigDecimal valor, BigDecimal taxaEsperada) {
        assertThat(calculadora.calcular(0, valor)).isEqualByComparingTo(taxaEsperada);
    }

    @Test
    void deveDevolverATaxaComDuasCasasDecimais() {
        assertThat(calculadora.calcular(15, new BigDecimal("1234.5")).scale()).isEqualTo(2);
    }
}

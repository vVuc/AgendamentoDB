package com.legado.testtecnico.transferencia.domain;

import lombok.Getter;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

/**
 * Tabela de taxas por dias até a transferência. É a única fonte dos valores: o cálculo e o
 * endpoint de taxas usados pelo front leem daqui.
 */
@Getter
public enum FaixaTaxa {

    MESMO_DIA(0, 0, "3.00", "2.5", "Mesmo dia"),
    ATE_10_DIAS(1, 10, "12.00", "0.0", "1 a 10 dias"),
    ATE_20_DIAS(11, 20, "0.00", "8.2", "11 a 20 dias"),
    ATE_30_DIAS(21, 30, "0.00", "6.9", "21 a 30 dias"),
    ATE_40_DIAS(31, 40, "0.00", "4.7", "31 a 40 dias"),
    ATE_50_DIAS(41, 50, "0.00", "1.7", "41 a 50 dias");

    private final int diasDe;
    private final int diasAte;
    private final BigDecimal taxaFixa;
    private final BigDecimal percentual;
    private final String rotulo;

    FaixaTaxa(int diasDe, int diasAte, String taxaFixa, String percentual, String rotulo) {
        this.diasDe = diasDe;
        this.diasAte = diasAte;
        this.taxaFixa = new BigDecimal(taxaFixa);
        this.percentual = new BigDecimal(percentual);
        this.rotulo = rotulo;
    }

    public static Optional<FaixaTaxa> paraDias(long dias) {
        return Arrays.stream(values())
                .filter(faixa -> faixa.contem(dias))
                .findFirst();
    }

    public boolean contem(long dias) {
        return dias >= diasDe && dias <= diasAte;
    }
}

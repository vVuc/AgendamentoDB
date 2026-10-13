package com.legado.testtecnico.transferencia.api.dto;

import com.legado.testtecnico.transferencia.domain.FaixaTaxa;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@Getter
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class FaixaTaxaResponse {

    private final int diasDe;
    private final int diasAte;
    private final String rotulo;
    private final BigDecimal taxaFixa;

    @Schema(description = "Percentual sobre o valor, como na tabela (8.2 = 8,2%)", example = "8.2")
    private final BigDecimal percentual;

    public static FaixaTaxaResponse de(FaixaTaxa faixa) {
        return new FaixaTaxaResponse(
                faixa.getDiasDe(),
                faixa.getDiasAte(),
                faixa.getRotulo(),
                faixa.getTaxaFixa(),
                faixa.getPercentual());
    }
}

package com.legado.testtecnico.transferencia.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class TransferenciaRequest {

    private static final String DEZ_DIGITOS = "\\d{10}";

    @NotNull(message = "Erro: informe a conta de origem.")
    @Pattern(regexp = DEZ_DIGITOS, message = "Erro: a conta de origem deve ter 10 dígitos.")
    @Schema(example = "0001234567")
    private String contaOrigem;

    @NotNull(message = "Erro: informe a conta de destino.")
    @Pattern(regexp = DEZ_DIGITOS, message = "Erro: a conta de destino deve ter 10 dígitos.")
    @Schema(example = "0007654321")
    private String contaDestino;

    @NotNull(message = "Erro: informe o valor.")
    @DecimalMin(value = "0.01", message = "Erro: o valor deve ser maior que zero.")
    // Teto de R$ 9.999.999.999.999,99: o front guarda o valor como number do JavaScript, que só é exato até 2^53.
    // Até esse teto, valor, taxa e total cabem em centavos sem arredondamento, e a coluna numeric(15,2) também.
    @Digits(integer = 13, fraction = 2,
            message = "Erro: o valor deve ser de até R$ 9.999.999.999.999,99, com no máximo 2 casas decimais.")
    @Schema(example = "1000.00", maximum = "9999999999999.99")
    private BigDecimal valor;

    @NotNull(message = "Erro: informe a data da transferência.")
    @Schema(example = "2026-10-20")
    private LocalDate dataTransferencia;
}

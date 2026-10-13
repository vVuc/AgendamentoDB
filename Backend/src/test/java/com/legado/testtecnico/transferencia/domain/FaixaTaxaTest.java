package com.legado.testtecnico.transferencia.domain;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class FaixaTaxaTest {

    @Test
    void asFaixasDevemCobrirDeZeroACinquentaDiasSemBuracosNemSobreposicao() {
        FaixaTaxa[] faixas = FaixaTaxa.values();

        assertThat(faixas[0].getDiasDe()).isZero();
        for (int i = 1; i < faixas.length; i++) {
            assertThat(faixas[i].getDiasDe()).isEqualTo(faixas[i - 1].getDiasAte() + 1);
        }
        assertThat(faixas[faixas.length - 1].getDiasAte()).isEqualTo(50);
    }

    @Test
    void naoDeveHaverFaixaParaDataPassadaNemAlemDeCinquentaDias() {
        assertThat(FaixaTaxa.paraDias(-1)).isEmpty();
        assertThat(FaixaTaxa.paraDias(51)).isEmpty();
    }
}

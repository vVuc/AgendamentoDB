package com.legado.testtecnico.transferencia.api;

import com.legado.testtecnico.transferencia.api.dto.FaixaTaxaResponse;
import com.legado.testtecnico.transferencia.domain.FaixaTaxa;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/taxas")
@Tag(name = "Taxas", description = "Tabela de faixas usada no cálculo da taxa")
public class TaxaController {

    // A tabela só muda com uma nova versão do back-end, então o navegador pode reaproveitá-la.
    private static final CacheControl CACHE_DE_UMA_HORA = CacheControl.maxAge(Duration.ofHours(1));

    @GetMapping
    @Operation(summary = "Lista as faixas de taxa",
            description = "O front usa a tabela para mostrar a prévia; o valor gravado é sempre o calculado no servidor.")
    public ResponseEntity<List<FaixaTaxaResponse>> listar() {
        List<FaixaTaxaResponse> faixas = Arrays.stream(FaixaTaxa.values())
                .map(FaixaTaxaResponse::de)
                .collect(Collectors.toList());
        return ResponseEntity.ok().cacheControl(CACHE_DE_UMA_HORA).body(faixas);
    }
}

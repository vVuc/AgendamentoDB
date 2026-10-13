package com.legado.testtecnico.transferencia.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaxaController.class)
class TaxaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void deveListarAsSeisFaixasComCacheDeUmaHora() throws Exception {
        mockMvc.perform(get("/api/taxas"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "max-age=3600"))
                .andExpect(jsonPath("$", hasSize(6)))
                .andExpect(jsonPath("$[0].diasDe").value(0))
                .andExpect(jsonPath("$[0].diasAte").value(0))
                .andExpect(jsonPath("$[0].rotulo").value("Mesmo dia"))
                .andExpect(jsonPath("$[0].taxaFixa").value(3.00))
                .andExpect(jsonPath("$[0].percentual").value(2.5))
                .andExpect(jsonPath("$[2].percentual").value(8.2))
                .andExpect(jsonPath("$[5].diasAte").value(50));
    }
}

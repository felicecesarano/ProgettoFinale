package it.epicode.capstone;

import it.epicode.capstone.entity.Cliente;
import it.epicode.capstone.entity.Fattura;
import it.epicode.capstone.enums.StatoFattura;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


@SpringBootTest
public class FatturaTest {

    @Autowired
    private FatturaService fatturaService;

    @Autowired
    private FatturaRepository fatturaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Test
    void testFindByCliente() {
        // Prendi un cliente esistente dal database
        List<Cliente> allClienti = clienteRepository.findAll();
        assertTrue(!allClienti.isEmpty(), "Non ci sono clienti nel database");

        Cliente cliente = allClienti.get(0);

        Fattura fattura1 = new Fattura();
        fattura1.setCliente(cliente);
        Fattura fattura2 = new Fattura();
        fattura2.setCliente(cliente);

        fatturaRepository.saveAll(List.of(fattura1, fattura2));

        List<Fattura> result = fatturaRepository.findByCliente(cliente);

        assertEquals(2, result.size());
    }

    @Test
    void testFindByStatoFattura() {

        Fattura fattura1 = new Fattura();
        fattura1.setStatoFattura(StatoFattura.INVIATA);
        Fattura fattura2 = new Fattura();
        fattura2.setStatoFattura(StatoFattura.SCARTATA);

        fatturaRepository.saveAll(List.of(fattura1, fattura2));

        List<Fattura> result = fatturaRepository.findByStatoFattura(StatoFattura.INVIATA);

        assertEquals(1, result.size());
        assertEquals(StatoFattura.INVIATA, result.get(0).getStatoFattura());
    }

    @Test
    void testFindByRangeImporto() {

        Fattura fattura1 = new Fattura();
        fattura1.setImporto(BigDecimal.valueOf(500));
        Fattura fattura2 = new Fattura();
        fattura2.setImporto(BigDecimal.valueOf(1500));
        Fattura fattura3 = new Fattura();
        fattura3.setImporto(BigDecimal.valueOf(2500));

        fatturaRepository.saveAll(List.of(fattura1, fattura2, fattura3));

        BigDecimal minImporto = BigDecimal.valueOf(1000);
        BigDecimal maxImporto = BigDecimal.valueOf(2000);

        List<Fattura> result = fatturaRepository.findByRangeImporto(minImporto, maxImporto);

        assertEquals(1, result.size());
        assertTrue(result.get(0).getImporto().compareTo(BigDecimal.valueOf(1500)) == 0);
    }



    @Test
    void testFindByData() {
        LocalDate dataRicerca = LocalDate.of(2024, 6, 1);

        List<Fattura> result = fatturaRepository.findByData(dataRicerca);

        for (Fattura fattura : result) {
            assertEquals(dataRicerca, fattura.getData());
        }
    }

    @AfterEach
    void tearDown() {
        fatturaRepository.deleteAll();
    }






}

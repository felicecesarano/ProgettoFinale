package it.epicode.capstone;

import it.epicode.capstone.entity.Cliente;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class ClienteTest {


    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private ClienteService clienteService;

    @Test
    void testElencaClientiPerNome() {

        Cliente cliente1 = new Cliente();
        cliente1.setRagioneSociale("Cliente B");
        Cliente cliente2 = new Cliente();
        cliente2.setRagioneSociale("Cliente A");
        clienteRepository.saveAll(Arrays.asList(cliente1,cliente2));

        List<Cliente> result = clienteRepository.elencaClientiPerNome();

        assertEquals(2, result.size());
        assertEquals("Cliente A", result.get(0).getRagioneSociale());
    }

    @Test
    void testElencaClientiPerFatturato() {
        Cliente cliente1 = new Cliente();
        cliente1.setRagioneSociale("Cliente 1");
        cliente1.setFatturatoAnnuale(BigDecimal.valueOf(1000));

        Cliente cliente2 = new Cliente();
        cliente2.setRagioneSociale("Cliente 2");
        cliente2.setFatturatoAnnuale(BigDecimal.valueOf(2000));

        clienteRepository.saveAll(Arrays.asList(cliente1, cliente2));

        List<Cliente> result = clienteRepository.elencaClientiPerFatturato();

        assertEquals(2, result.size());
        assertEquals("Cliente 2", result.get(0).getRagioneSociale());
    }

    @Test
    void testFindByFatturatoAnnuo() {

        BigDecimal minRevenue = BigDecimal.valueOf(1000);
        BigDecimal maxRevenue = BigDecimal.valueOf(2000);
        Cliente cliente1 = new Cliente();
        cliente1.setRagioneSociale("Cliente 1");
        cliente1.setFatturatoAnnuale(BigDecimal.valueOf(1500));
        Cliente cliente2 = new Cliente();
        cliente2.setRagioneSociale("Cliente 2");
        cliente2.setFatturatoAnnuale(BigDecimal.valueOf(2500));
        clienteRepository.saveAll(List.of(cliente1, cliente2));

        List<Cliente> result = clienteRepository.findByFatturatoAnnuo(minRevenue, maxRevenue);

        assertEquals(1, result.size());
        assertEquals("Cliente 1", result.get(0).getRagioneSociale());
    }

    @Test
    void testFindByDataInserimento() {
        List<Cliente> allClienti = clienteRepository.findAll();

        if (!allClienti.isEmpty()) {
            Cliente clienteEsistente = allClienti.get(0);
            LocalDate dataInserimentoCliente = clienteEsistente.getDataInserimento();

            List<Cliente> result = clienteRepository.findByDataInserimento(dataInserimentoCliente);

            for (Cliente cliente : result) {
                assertEquals(dataInserimentoCliente, cliente.getDataInserimento());
            }
        } else {
            System.out.println("La lista dei clienti è vuota.");
        }
    }

    @Test
    void testFindByDataUltimoContatto() {
        List<Cliente> allClienti = clienteRepository.findAll();

        if (!allClienti.isEmpty()) {
            Cliente clienteEsistente = allClienti.get(0);
            LocalDate dataUltimoContattoCliente = clienteEsistente.getDataUltimoContatto();

            List<Cliente> result = clienteRepository.findByDataUltimoContatto(dataUltimoContattoCliente);

            for (Cliente cliente : result) {
                assertTrue(cliente.getDataUltimoContatto().isEqual(dataUltimoContattoCliente) || cliente.getDataUltimoContatto().isBefore(dataUltimoContattoCliente));
            }
        } else {
            System.out.println("La lista dei clienti è vuota.");
        }
    }


    @AfterEach
    void tearDown() {
        clienteRepository.deleteAll();
    }



}

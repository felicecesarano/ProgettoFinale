package it.epicode.capstone;


import it.epicode.capstone.entity.Utente;
import it.epicode.capstone.repository.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.crypto.password.PasswordEncoder;

@SuppressWarnings("all")
@SpringBootApplication
@ComponentScan(basePackages = "it.epicode.capstone")
public class Start implements CommandLineRunner {

    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(Start.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        Utente admin = new Utente();
        admin.setEmail("cesarano.fc@gmail.com");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setNome("Felice");
        admin.setCognome("Cesarano");
        utenteRepository.save(admin);

        Utente utente1 = new Utente();
        utente1.setEmail("utente1@gmail.com");
        utente1.setPassword(passwordEncoder.encode("password"));
        utente1.setNome("Enzo");
        utente1.setCognome("Cesarano");
        utenteRepository.save(utente1);
    }
}

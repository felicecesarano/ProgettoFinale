package it.epicode.capstone.repository;

import it.epicode.capstone.entity.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtenteRepository extends JpaRepository<Utente, Integer> {

    Optional<Utente> findByEmail(String email);

}

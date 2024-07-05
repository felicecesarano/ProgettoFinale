package it.epicode.capstone.service;

import it.epicode.capstone.dto.SignupDto;
import it.epicode.capstone.dto.UtenteDto;
import it.epicode.capstone.entity.Utente;
import it.epicode.capstone.exception.BadRequestException;
import it.epicode.capstone.repository.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtenteService {

    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSenderImpl javaMailSender;

    public List<Utente> getAllUtenti() {
        return utenteRepository.findAll();
    }

    public Optional<Utente> getUtenteByEmail(String email) {
        return utenteRepository.findByEmail(email);
    }

    public Optional<Utente> getUtenteById(Integer id) {
        return utenteRepository.findById(id);
    }

    public SignupDto saveUtente(UtenteDto utenteDto) {
        if (getUtenteByEmail(utenteDto.getEmail()).isEmpty()) {
            Utente utente = new Utente();
            utente.setEmail(utenteDto.getEmail());
            utente.setNome(utenteDto.getNome());
            utente.setCognome(utenteDto.getCognome());
            utente.setPassword(passwordEncoder.encode(utenteDto.getPassword()));
            utente.setRole(utenteDto.getRole()); // Impostiamo il ruolo dall'UtenteDto
            utenteRepository.save(utente);
            sendMail(utente.getEmail());

            SignupDto signupDto = new SignupDto();
            signupDto.setUtente(utente);

            return signupDto;
        } else {
            throw new BadRequestException("Lo username è già stato preso.");
        }
    }

    public void deleteUtenteById(Integer id) {
        utenteRepository.deleteById(id);
    }

    public Utente updateUtenteRole(Integer id, String role) {
        Utente utente = utenteRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Utente non trovato con id: " + id));

        utente.setRole(role);
        return utenteRepository.save(utente);
    }

    private void sendMail(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Signup");
        message.setText("Registrazione effettuata!");

        javaMailSender.send(message);
    }
}


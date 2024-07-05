package it.epicode.capstone.service;

import it.epicode.capstone.dto.AuthDataDto;
import it.epicode.capstone.dto.UtenteLoginDto;
import it.epicode.capstone.entity.Utente;
import it.epicode.capstone.exception.NotFoundException;
import it.epicode.capstone.exception.UnauthorizedException;
import it.epicode.capstone.security.JwtTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UtenteService utenteService;

    @Autowired
    private JwtTool jwtTool;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthDataDto authenticateUtenteAndGenerateToken(UtenteLoginDto utenteLoginDto) {
        Optional<Utente> utenteOptional = utenteService.getUtenteByEmail(utenteLoginDto.getEmail());

        if (utenteOptional.isPresent()) {
            Utente utente = utenteOptional.get();
            if (passwordEncoder.matches(utenteLoginDto.getPassword(), utente.getPassword())) {
                AuthDataDto authDataDto = new AuthDataDto();
                authDataDto.setAccessToken(jwtTool.createToken(utente));
                authDataDto.setUtente(utente);
                return authDataDto;
            } else {
                throw new UnauthorizedException("Email o password errata.");
            }
        } else {
            throw new NotFoundException("Utente con email: " + utenteLoginDto.getEmail() + " non trovato.");
        }
    }
}


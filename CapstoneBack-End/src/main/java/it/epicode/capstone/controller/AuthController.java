package it.epicode.capstone.controller;

import it.epicode.capstone.dto.AuthDataDto;
import it.epicode.capstone.dto.SignupDto;
import it.epicode.capstone.dto.UtenteDto;
import it.epicode.capstone.dto.UtenteLoginDto;
import it.epicode.capstone.entity.Utente;
import it.epicode.capstone.exception.BadRequestException;
import it.epicode.capstone.service.AuthService;
import it.epicode.capstone.service.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@SuppressWarnings("all")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UtenteService utenteService;

    @PostMapping("/signup")
    public SignupDto signup(@RequestBody @Validated UtenteDto utenteDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        return utenteService.saveUtente(utenteDto);
    }

    @PostMapping("/login")
    public AuthDataDto login(@RequestBody @Validated UtenteLoginDto utenteLoginDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        return authService.authenticateUtenteAndGenerateToken(utenteLoginDTO);
    }

    @PutMapping("/utenti/{id}/role")
    public Utente updateUtenteRole(@PathVariable Integer id, @RequestParam String role) {
        try {
            if (!role.equalsIgnoreCase("User") && !role.equalsIgnoreCase("Admin")) {
                throw new BadRequestException("Il ruolo deve essere 'User' o 'Admin'.");
            }
            return utenteService.updateUtenteRole(id, role);
        } catch (BadRequestException e) {
            // Aggiungi del logging per il messaggio di errore
            e.printStackTrace(); // Questo può essere sostituito con un logging più robusto come Log4j o simile
            throw e; // Rilancia l'eccezione per farla gestire globalmente
        }
    }
}

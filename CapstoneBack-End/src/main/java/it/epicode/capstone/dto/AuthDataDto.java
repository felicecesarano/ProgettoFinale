package it.epicode.capstone.dto;

import it.epicode.capstone.entity.Utente;
import lombok.Data;

@Data
public class AuthDataDto {

    private String accessToken;
    private Utente utente;
}

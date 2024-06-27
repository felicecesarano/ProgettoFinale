package it.epicode.capstone.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UtenteDto {


    @Email
    @NotNull
    private String email;

    @NotNull
    private String nome;

    @NotNull
    private String cognome;


    @NotNull
    private String password;



    public UtenteDto( String email, String nome, String cognome, String password) {
        this.email = email;
        this.nome = nome;
        this.cognome = cognome;
        this.password =  password;
    }

}

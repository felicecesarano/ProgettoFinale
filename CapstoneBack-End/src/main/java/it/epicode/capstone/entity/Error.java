package it.epicode.capstone.entity;

import lombok.Data;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;

@SuppressWarnings("all")
@Data
public class Error {
    private String message;
    private LocalDateTime date;
    private HttpStatus status;}
package it.epicode.capstone.dto;

public class CheckoutDto {
    private String sessionId;

    public CheckoutDto(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
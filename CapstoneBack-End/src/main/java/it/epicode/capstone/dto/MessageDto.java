package it.epicode.capstone.dto;

public class MessageDto {
    private String chatId;
    private String text;

    public MessageDto() {
    }

    public MessageDto(String chatId, String text) {
        this.chatId = chatId;
        this.text = text;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @Override
    public String toString() {
        return "MessageDto{" +
                "chatId='" + chatId + '\'' +
                ", text='" + text + '\'' +
                '}';
    }
}

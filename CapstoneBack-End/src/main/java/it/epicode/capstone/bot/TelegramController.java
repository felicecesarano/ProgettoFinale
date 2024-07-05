package it.epicode.capstone.bot;

import it.epicode.capstone.dto.MessageDto;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

@RestController
public class TelegramController {

    private final MyTelegramBot myTelegramBot;

    public TelegramController(MyTelegramBot myTelegramBot) {
        this.myTelegramBot = myTelegramBot;
    }

    @PostMapping("/api/telegram/sendMessage")
    public void sendMessage(@RequestBody MessageDto messageDto) {
        SendMessage message = new SendMessage();
        message.setChatId(messageDto.getChatId());
        message.setText(messageDto.getText());
        try {
            myTelegramBot.execute(message);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}


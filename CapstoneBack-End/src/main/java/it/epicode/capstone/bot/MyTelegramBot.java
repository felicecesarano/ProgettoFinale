package it.epicode.capstone.bot;

import it.epicode.capstone.entity.Product;
import it.epicode.capstone.service.ProductService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendPhoto;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;

import java.util.*;

@Component
public class MyTelegramBot extends TelegramLongPollingBot {

    private final ProductService productService;
    private final Map<String, List<Product>> productDetailsMap = new HashMap<>();
    private final String botToken;

    @Autowired
    public MyTelegramBot(ProductService productService, @Value("${telegram.bot.token}") String botToken) {
        this.productService = productService;
        this.botToken = botToken;
    }

    @Override
    public String getBotUsername() {
        return "LoShowDeiCompletini_bot";
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageText = update.getMessage().getText();
            long chatId = update.getMessage().getChatId();

            if ("/start".equals(messageText)) {
                sendWelcomeMessage(chatId);
            } else {
                sendMessage(chatId, "Received: " + messageText);
            }
        } else if (update.hasCallbackQuery()) {
            String callbackData = update.getCallbackQuery().getData();
            long chatId = update.getCallbackQuery().getMessage().getChatId();

            if (callbackData.startsWith("CATEGORY_")) {
                String category = callbackData.replace("CATEGORY_", "");
                sendProductsByCategory(chatId, category);
            } else if (callbackData.startsWith("PRODUCT_")) {
                String productName = callbackData.replace("PRODUCT_", "").replace("_", " ");
                List<Product> products = productDetailsMap.get(callbackData);

                if (products != null && !products.isEmpty()) {
                    sendProductDetails(chatId, productName, products);
                } else {
                    sendMessage(chatId, "Nessun prodotto trovato con il nome: " + productName);
                }
            } else if ("/home".equals(callbackData)) {
                sendWelcomeMessage(chatId); // Torna al menu principale
            } else {
                sendMessage(chatId, "Hai selezionato: " + callbackData);
            }
        }
    }

    private void sendWelcomeMessage(long chatId) {
        String welcomeText = "Benvenuto a Lo Show Dei Completini, qui potrai trovare le tue shirt preferite";

        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText(welcomeText);

        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> rowsInline = new ArrayList<>();

        List<InlineKeyboardButton> row1 = new ArrayList<>();
        row1.add(createInlineKeyboardButton("Serie A", "CATEGORY_SerieA"));
        row1.add(createInlineKeyboardButton("Premier League", "CATEGORY_PremierLeague"));
        row1.add(createInlineKeyboardButton("Bundesliga", "CATEGORY_Bundesliga"));

        List<InlineKeyboardButton> row2 = new ArrayList<>();
        row2.add(createInlineKeyboardButton("La Liga", "CATEGORY_LaLiga"));
        row2.add(createInlineKeyboardButton("Ligue 1", "CATEGORY_Ligue1"));
        row2.add(createInlineKeyboardButton("Vintage", "CATEGORY_Vintage"));

        rowsInline.add(row1);
        rowsInline.add(row2);
        inlineKeyboardMarkup.setKeyboard(rowsInline);

        message.setReplyMarkup(inlineKeyboardMarkup);

        try {
            execute(message);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    private void sendProductsByCategory(long chatId, String category) {
        try {
            List<Product> products = productService.getProductsByCategory(category);

            if (products.isEmpty()) {
                sendMessage(chatId, "Non ci sono prodotti disponibili per la categoria: " + category);
                return;
            }

            Map<String, List<Product>> productMap = new HashMap<>();

            // Raggruppiamo i prodotti per nome
            for (Product product : products) {
                String productName = product.getName();
                if (!productMap.containsKey(productName)) {
                    productMap.put(productName, new ArrayList<>());
                }
                productMap.get(productName).add(product);
            }

            SendMessage message = new SendMessage();
            message.setChatId(String.valueOf(chatId));
            message.setText("Scegli un prodotto:");

            InlineKeyboardMarkup markupInline = new InlineKeyboardMarkup();
            List<List<InlineKeyboardButton>> rowsInline = new ArrayList<>();

            List<InlineKeyboardButton> currentRow = new ArrayList<>();
            int buttonsPerRow = 3; // Numero di pulsanti per riga

            for (Map.Entry<String, List<Product>> entry : productMap.entrySet()) {
                String productName = entry.getKey();
                List<Product> productList = entry.getValue();

                InlineKeyboardButton button = new InlineKeyboardButton();
                button.setText(productName);
                button.setCallbackData("PRODUCT_" + productName.replace(" ", "_"));

                currentRow.add(button);

                // Se abbiamo raggiunto il numero massimo di pulsanti per riga, aggiungiamo la riga e creiamo una nuova riga vuota
                if (currentRow.size() >= buttonsPerRow) {
                    rowsInline.add(new ArrayList<>(currentRow));
                    currentRow.clear();
                }

                // Memorizza i dettagli del prodotto per il pulsante
                productDetailsMap.put(button.getCallbackData(), productList);
            }

            // Aggiungiamo l'ultima riga se non è vuota
            if (!currentRow.isEmpty()) {
                rowsInline.add(currentRow);
            }

            // Pulsante per tornare alla home
            List<InlineKeyboardButton> returnRow = new ArrayList<>();
            returnRow.add(createInlineKeyboardButton("Ritorna al menu principale", "/home"));
            rowsInline.add(returnRow);

            markupInline.setKeyboard(rowsInline);
            message.setReplyMarkup(markupInline);

            execute(message); // Invia i pulsanti dei nomi dei prodotti

        } catch (TelegramApiException e) {
            e.printStackTrace();
            sendMessage(chatId, "Si è verificato un errore durante l'invio dei prodotti per la categoria " + category);
        } catch (Exception e) {
            e.printStackTrace();
            sendMessage(chatId, "Si è verificato un errore generale durante l'elaborazione della richiesta");
        }
    }

    private void sendProductDetails(long chatId, String productName, List<Product> products) {
        for (Product product : products) {
            try {
                SendPhoto sendPhoto = new SendPhoto();
                sendPhoto.setChatId(String.valueOf(chatId));
                sendPhoto.setPhoto(new InputFile(product.getImg()));
                sendPhoto.setCaption("Descrizione: " + product.getDescription() + "\n" +
                        "Prezzo: " + product.getPrice() + "€");

                execute(sendPhoto);
            } catch (TelegramApiException e) {
                e.printStackTrace();
                sendMessage(chatId, "Si è verificato un errore durante l'invio dell'immagine del prodotto");
            }
        }
    }

    private InlineKeyboardButton createInlineKeyboardButton(String text, String callbackData) {
        InlineKeyboardButton button = new InlineKeyboardButton();
        button.setText(text);
        button.setCallbackData(callbackData);
        return button;
    }

    private void sendMessage(long chatId, String text) {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText(text != null ? text : "Testo del messaggio non disponibile");

        try {
            execute(message);
        } catch (TelegramApiException e) {
            e.printStackTrace();
            sendMessage(chatId, "Si è verificato un errore durante l'invio del messaggio");
        } catch (NullPointerException e) {
            e.printStackTrace();
            sendMessage(chatId, "Errore: Il testo del messaggio è null");
        }
    }

}

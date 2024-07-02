package it.epicode.capstone.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    @Value("${stripe.secret.key}")
    private String secretKey; // Configurazione della chiave segreta di Stripe

    public StripeService() {
        Stripe.apiKey = secretKey;
    }

    public PaymentIntent createPaymentIntent(int amount, String currency) throws StripeException {
        PaymentIntent intent = PaymentIntent.create(new PaymentIntentCreateParams.Builder()
                .setAmount((long) amount)
                .setCurrency(currency)
                .build());
        return intent;
    }

// Altri metodi per interagire con Stripe come aggiungere metodi per gestire i clienti, ecc.
}
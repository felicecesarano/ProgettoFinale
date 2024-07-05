package it.epicode.capstone.controller;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import it.epicode.capstone.dto.PaymentDto;
import it.epicode.capstone.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebhookCrontroller {

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    @Autowired
    private OrderService orderService;

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhookEvent(@RequestBody String payload,
                                                @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            // Verifica e decodifica l'evento webhook
            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);

            // Logging dell'evento ricevuto
            System.out.println("Webhook received: " + event.getType() + " - " + event.getId());

            PaymentDto paymentDto = null;

            // Gestione dell'evento basato sul tipo
            switch (event.getType()) {
                case "charge.succeeded":
                    Charge charge = (Charge) event.getData().getObject();
                    paymentDto = convertToPaymentDto(charge);
                    System.out.println("Payment processed for Charge: " + charge.getId());
                    break;
                case "payment_intent.succeeded":
                    PaymentIntent paymentIntent = (PaymentIntent) event.getData().getObject();
                    paymentDto = convertToPaymentDto(paymentIntent);
                    System.out.println("Payment processed for PaymentIntent: " + paymentIntent.getId());
                    break;
                // Gestisci altri tipi di eventi webhook se necessario
                default:
                    System.out.println("Unhandled event type: " + event.getType());
                    break;
            }

            if (paymentDto != null) {
                orderService.processPayment(paymentDto);
            }

            return ResponseEntity.ok().build();
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Errore nella verifica della firma webhook: " + e.getMessage());
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore di Stripe durante la gestione dell'evento webhook: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante la gestione dell'evento webhook: " + e.getMessage());
        }
    }

    private PaymentDto convertToPaymentDto(Charge charge) {
        Long amount = charge.getAmount();
        Long customerId = Long.valueOf(charge.getMetadata().get("customerId"));
        Long productId = Long.valueOf(charge.getMetadata().get("productId"));
        String size = charge.getMetadata().get("size");
        Integer quantity = Integer.valueOf(charge.getMetadata().get("quantity"));

        return new PaymentDto(amount, customerId, productId, size, quantity);
    }

    private PaymentDto convertToPaymentDto(PaymentIntent paymentIntent) {
        Long amount = paymentIntent.getAmount();
        Long customerId = Long.valueOf(paymentIntent.getMetadata().get("customerId"));
        Long productId = Long.valueOf(paymentIntent.getMetadata().get("productId"));
        String size = paymentIntent.getMetadata().get("size");
        Integer quantity = Integer.valueOf(paymentIntent.getMetadata().get("quantity"));

        return new PaymentDto(amount, customerId, productId, size, quantity);
    }
}


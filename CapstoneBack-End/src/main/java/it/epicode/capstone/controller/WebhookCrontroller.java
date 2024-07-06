package it.epicode.capstone.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
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

import java.util.HashMap;
import java.util.Map;

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
            // Verify and decode the webhook event
            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);

            // Log the received event
            System.out.println("Webhook received: " + event.getType() + " - " + event.getId());

            PaymentDto paymentDto = null;

            // Handle the event based on type
            switch (event.getType()) {
                case "charge.succeeded":
                    paymentDto = handleChargeSucceeded(event);
                    break;
                case "payment_intent.succeeded":
                    paymentDto = handlePaymentIntentSucceeded(event);
                    break;
                case "checkout.session.completed":
                    handleCheckoutSessionCompleted(event);
                    break;
                default:
                    System.out.println("Unhandled event type: " + event.getType());
                    break;
            }

            if (paymentDto != null) {
                orderService.processPayment(paymentDto);
            }

            return ResponseEntity.ok().build();
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error verifying webhook signature: " + e.getMessage());
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Stripe error while handling webhook event: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error handling webhook event: " + e.getMessage());
        }
    }

    private PaymentDto handleChargeSucceeded(Event event) {
        Charge charge = (Charge) event.getData().getObject();
        System.out.println("Payment processed for Charge: " + charge.getId());
        return convertToPaymentDto(charge);
    }

    private PaymentDto handlePaymentIntentSucceeded(Event event) {
        PaymentIntent paymentIntent = (PaymentIntent) event.getData().getObject();
        System.out.println("Payment processed for PaymentIntent: " + paymentIntent.getId());
        return convertToPaymentDto(paymentIntent);
    }

    private void handleCheckoutSessionCompleted(Event event) {
        Session session = (Session) event.getData().getObject();
        System.out.println("Checkout session completed: " + session.getId());

        // Retrieve metadata as JSON string
        String metadataJson = session.getMetadata().get("metadata");

        if (metadataJson != null) {
            try {
                // Convert JSON metadata to Map<String, Object>
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> metadataMap = mapper.readValue(metadataJson, new TypeReference<Map<String,Object>>() {});

                // Retrieve values from metadataMap
                String customerId = (String) metadataMap.get("customerId");
                System.out.println("Customer ID from second metadata: " + customerId);

                String productId = (String) metadataMap.get("productId");
                System.out.println("Product ID from second metadata: " + productId);

                // Continue retrieving other necessary fields
            } catch (Exception e) {
                System.err.println("Error processing metadata: " + e.getMessage());
            }
        } else {
            System.err.println("Second metadata object is null or not found.");
        }

        // Process checkout session completed to create the order
        processCheckoutSession(session);
    }

    private void processCheckoutSession(Session session) {
        try {
            // Retrieve metadata from checkout session
            Map<String, String> metadata = session.getMetadata();
            Long customerId = Long.parseLong(metadata.get("customerId"));
            Long productId = Long.parseLong(metadata.get("productId"));
            String size = metadata.get("size");
            Integer quantity = Integer.parseInt(metadata.get("quantity"));
            Long totalAmount = Long.parseLong(metadata.get("totalAmount"));

            // Build PaymentDto object for payment processing
            PaymentDto paymentDto = new PaymentDto(totalAmount, customerId, productId, size, quantity);

            // Process payment and save order in database
            orderService.processPayment(paymentDto);
        } catch (NumberFormatException e) {
            System.err.println("Error parsing metadata: " + e.getMessage());
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

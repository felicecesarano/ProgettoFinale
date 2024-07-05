package it.epicode.capstone.controller;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import it.epicode.capstone.dto.CheckoutDto;
import it.epicode.capstone.dto.PaymentDto;
import it.epicode.capstone.entity.Order;
import it.epicode.capstone.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
public class StripeController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    private final OrderService orderService;

    @Autowired
    public StripeController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody List<PaymentDto> paymentDtos) {
        try {
            Stripe.apiKey = stripeSecretKey;

            List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
            Map<String, String> metadata = new HashMap<>();

            for (PaymentDto paymentDto : paymentDtos) {
                if (paymentDto.getAmount() == null || paymentDto.getAmount() <= 0) {
                    return ResponseEntity.badRequest().body("Amount must be greater than zero");
                }

                metadata.put("customerId", String.valueOf(paymentDto.getCustomerId()));
                metadata.put("productId", String.valueOf(paymentDto.getProductId()));
                metadata.put("size", paymentDto.getSize());
                metadata.put("quantity", String.valueOf(paymentDto.getQuantity()));

                SessionCreateParams.LineItem.PriceData priceData =
                        SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("eur")
                                .setUnitAmount(paymentDto.getAmount())
                                .setProductData(
                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                .setName("Product")
                                                .build())
                                .build();

                lineItems.add(
                        SessionCreateParams.LineItem.builder()
                                .setPriceData(priceData)
                                .setQuantity((long) paymentDto.getQuantity())
                                .build()
                );
            }

            SessionCreateParams params =
                    SessionCreateParams.builder()
                            .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                            .addAllLineItem(lineItems)
                            .setMode(SessionCreateParams.Mode.PAYMENT)
                            .putAllMetadata(metadata)
                            .setSuccessUrl("http://localhost:4200/success")
                            .setCancelUrl("http://localhost:4200/cancel")
                            .build();

            Session session = Session.create(params);

            // Return the session ID to the client
            return ResponseEntity.ok().body(new CheckoutDto(session.getId()));
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/webhooks")
    public ResponseEntity<?> handleWebhookEvent(@RequestBody String payload,
                                                @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);

            switch (event.getType()) {
                case "checkout.session.completed":
                    Session session = (Session) event.getData().getObject();
                    processCheckoutSession(session);
                    break;
                default:
                    System.out.println("Unhandled event type: " + event.getType());
                    break;
            }

            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Stripe signature: " + e.getMessage());
        } catch (StripeException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Stripe error: " + e.getMessage());
        }
    }

    private void processCheckoutSession(Session session) {
        try {
            Map<String, String> metadata = session.getMetadata();
            Long customerId = Long.parseLong(metadata.get("customerId"));
            Long productId = Long.parseLong(metadata.get("productId"));
            String size = metadata.get("size");
            Integer quantity = Integer.parseInt(metadata.get("quantity"));

            // Assuming you have a method in OrderService to process the payment
            PaymentDto paymentDto = new PaymentDto();
            paymentDto.setAmount(session.getAmountTotal());
            paymentDto.setCustomerId(customerId);
            paymentDto.setProductId(productId);
            paymentDto.setSize(size);
            paymentDto.setQuantity(quantity);

            orderService.processPayment(paymentDto);
        } catch (NumberFormatException e) {
            System.err.println("Error parsing metadata: " + e.getMessage());
        }
    }
}

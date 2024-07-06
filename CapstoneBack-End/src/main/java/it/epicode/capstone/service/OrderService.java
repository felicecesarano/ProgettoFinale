package it.epicode.capstone.service;

import it.epicode.capstone.dto.PaymentDto;
import it.epicode.capstone.entity.Order;
import it.epicode.capstone.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public void saveOrder(Order order) {
        orderRepository.save(order);
    }

    public void processPayment(PaymentDto paymentDto) {
        // Converti PaymentDto in Order
        Order order = convertToOrder(paymentDto);
        // Salvare l'ordine
        saveOrder(order);
    }

    private Order convertToOrder(PaymentDto paymentDto) {
        Order order = new Order();
        order.setCustomerId(paymentDto.getCustomerId());
        order.setProductId(paymentDto.getProductId());
        order.setSize(paymentDto.getSize());
        order.setQuantity(paymentDto.getQuantity());
        order.setTotalAmount(paymentDto.getAmount());
        return order;
    }
}
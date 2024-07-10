package it.epicode.capstone.service;

import it.epicode.capstone.dto.PaymentDto;
import it.epicode.capstone.entity.Order;
import it.epicode.capstone.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public void saveOrder(Order order) {
        orderRepository.save(order);
    }

    public void processPayment(PaymentDto paymentDto) {
        Order order = convertToOrder(paymentDto);


        order.setStatus("Non spedito");

        saveOrder(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByCustomerId(userId);
    }

    public void updateOrderStatus(Long orderId, String newStatus) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        optionalOrder.ifPresent(order -> {
            order.setStatus(newStatus);
            orderRepository.save(order);
        });
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

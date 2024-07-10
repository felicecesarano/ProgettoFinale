package it.epicode.capstone.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;

    private Long productId;

    private String size;

    private Integer quantity;

    private Long totalAmount;

    private String status = "Non spedito";

    public void updateStatus(String newStatus) {
        this.status = newStatus;
    }
}

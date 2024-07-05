package it.epicode.capstone.dto;

public class PaymentDto {
    private Long amount;
    private Long customerId;
    private Long productId;
    private String size;
    private Integer quantity;

    public PaymentDto() {
    }

    public PaymentDto(Long amount, Long customerId, Long productId, String size, Integer quantity) {
        this.amount = amount;
        this.customerId = customerId;
        this.productId = productId;
        this.size = size;
        this.quantity = quantity;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "PaymentDto{" +
                "amount=" + amount +
                ", customerId=" + customerId +
                ", productId=" + productId +
                ", size='" + size + '\'' +
                ", quantity=" + quantity +
                '}';
    }
}

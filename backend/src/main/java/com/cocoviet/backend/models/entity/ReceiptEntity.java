package com.cocoviet.backend.models.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "receipt")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReceiptEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String receiptDetailId;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false) // Đổi từ productOrder_id → order_id
    OrderEntity order;

    @ManyToOne
    @JoinColumn(name = "variant_id", nullable = false)
    ProductVariantEntity variant;

    @Column(nullable = false)
    Long quantity;

    @Column(nullable = false)
    BigDecimal price;
}

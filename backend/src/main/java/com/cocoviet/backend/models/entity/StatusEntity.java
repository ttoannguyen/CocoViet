package com.cocoviet.backend.models.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "status")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class StatusEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long statusId;

    @Column
    String statusName;

    @OneToMany(mappedBy = "status")
    List<ProductOrderEntity> productOrders;
}
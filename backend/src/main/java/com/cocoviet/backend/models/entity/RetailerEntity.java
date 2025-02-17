package com.cocoviet.backend.models.entity;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;


@Entity
@Table(name = "retailer")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RetailerEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String retailerId;

    @Column
    String retailerName;

    @Column
    String retailerPassword;

    @Column
    String retailerEmail;

    @Column
    String phoneNumbers;

    @Column
    String retailerAvatar;

    @Column
    String retailerAddress;

    @Column
    LocalDateTime createdAt;

    @OneToMany(mappedBy = "retailer")
    Set<ProductEntity> products;

    @OneToMany(mappedBy = "retailer")
    Set<PostEntity> posts;
}
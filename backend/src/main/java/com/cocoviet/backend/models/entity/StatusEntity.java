package com.cocoviet.backend.models.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    @GeneratedValue(strategy = GenerationType.UUID)
    String statusId;

    @Column
    String statusName;
}
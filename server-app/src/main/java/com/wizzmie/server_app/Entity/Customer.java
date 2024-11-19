package com.wizzmie.server_app.Entity;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import lombok.Data;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "customer")
public class Customer {
    @Id
    private Integer id;

    private String name;
    private String phone;
    
    // @ManyToOne
    // @JoinColumn(name = "status_id", referencedColumnName = "id", nullable = false)
    // @Enumerated(EnumType.STRING)
    // @Column(nullable = false)
    // private Role role;
}

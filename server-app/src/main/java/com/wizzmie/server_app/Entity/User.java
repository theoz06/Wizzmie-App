package com.wizzmie.server_app.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;


import com.wizzmie.server_app.Services.EnumRole;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "user")
public class User {
    
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String nik;
    private String password;


    // @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    // @JoinTable(
    //     name = "user_role",
    //     joinColumns = @JoinColumn(name = "user_id"),
    //     inverseJoinColumns = @JoinColumn(name = "role_id")
    // )
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnumRole role;

    
    public EnumRole getRole() {
        return role;
    }

    public void setRole(EnumRole role) {
        this.role = role;  // Set role directly as EnumRole
    }

}

package com.wizzmie.server_app.Entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Menu {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;    

    private String name;
    private String description;
    private Double price;
    private String image;
    private Boolean isAvailable;


    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id", nullable = false)
    private Category category;
}

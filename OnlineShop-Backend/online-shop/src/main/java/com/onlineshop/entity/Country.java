package com.onlineshop.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name="country")
@Setter
@Getter
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="shortname")
    private String shortName;

    @Column(name="name")
    private String name;

    @Column(name="phonecode")
    private Integer phoneCode;

    @OneToMany(mappedBy = "country")
    @JsonIgnore
    private List<State> states;

}

package com.Yabyer.PaymentServiceApp.model;

import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.Type;
import java.util.ArrayList;
import java.util.*;
// Use the jakarta.persistence package
//import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Column;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private int balance; //default
    private String password;
    private String username;
    // public ArrayList<int[]> queries = new  ArrayList<>();
    @ElementCollection
    @CollectionTable(
            name = "user_queries",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @MapKeyColumn(name = "requester_id")
    @Column(name = "amount")
    @Cascade({CascadeType.ALL})
    private Map<Integer, Integer> queries = new HashMap<>();
    public User(String n, int b, String u, String q){
        name = n;
        balance = b;
        username = u;
        password = q;
    }
    public User(){}

    public void addQuery(int requesterId, int amount) {
        queries.put(requesterId, amount);
    }
    public int getQuery(int requesterId){
        return queries.get(requesterId);
    }

    public void removeQuery(int requesterId) {
        queries.remove(requesterId);
    }
    public Map<Integer,Integer> getQueries(){
        return queries;
    }


    public int getBalance() {
        return balance;
    }

    public void setBalance(int balance) {
        this.balance = balance;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}

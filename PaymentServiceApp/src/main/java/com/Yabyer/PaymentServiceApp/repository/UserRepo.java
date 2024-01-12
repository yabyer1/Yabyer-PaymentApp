package com.Yabyer.PaymentServiceApp.repository;


import com.Yabyer.PaymentServiceApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
}

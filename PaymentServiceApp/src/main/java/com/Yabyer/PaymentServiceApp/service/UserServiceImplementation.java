package com.Yabyer.PaymentServiceApp.service;

import com.Yabyer.PaymentServiceApp.model.User;
import com.Yabyer.PaymentServiceApp.repository.UserRepo;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImplementation implements UserService {
    @Autowired
    private UserRepo userRepo;

    @Override
    @Transactional
    public User saveUser(User user){ return userRepo.save(user);};

    @Override
    public List<User> getAllUsers(){return userRepo.findAll();}

    @Override
    public User get(int toID){
        return userRepo.getReferenceById(toID);
    }
}

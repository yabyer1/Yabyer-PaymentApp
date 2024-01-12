package com.Yabyer.PaymentServiceApp.service;

import com.Yabyer.PaymentServiceApp.model.User;


import java.util.List;

public interface UserService {
    public User saveUser(User user);
    public List<User> getAllUsers();

    User get(int toID);
}

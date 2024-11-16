package com.wizzmie.server_app.Controllers.Implements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wizzmie.server_app.Services.Implements.UserServiceImpl;

@RestController
@RequestMapping("api/user")
public class UserController {
    
    @Autowired
    private UserServiceImpl userServiceImpl;

    
}

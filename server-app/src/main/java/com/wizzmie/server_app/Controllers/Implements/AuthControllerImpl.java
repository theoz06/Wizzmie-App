package com.wizzmie.server_app.Controllers.Implements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.wizzmie.server_app.DTO.Request.AuthRequest;
import com.wizzmie.server_app.DTO.Respon.AuthResponse;
import com.wizzmie.server_app.Services.Implements.AuthServiceImpl;

@RestController
@RequestMapping("api/auth")
public class AuthControllerImpl {
    
    @Autowired
    private AuthServiceImpl authServiceImpl;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request){
        try {
            AuthResponse response = authServiceImpl.login(request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getStatus());
        }
    }
}

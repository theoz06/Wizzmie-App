package com.wizzmie.server_app.Controllers.Implements;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

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
    public ResponseEntity<?> login(@RequestBody AuthRequest request){
        try {
            AuthResponse response = authServiceImpl.login(request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("status", e.getStatus().value());
            errorBody.put("message", e.getReason());
            errorBody.put("error", e.getStatus().getReasonPhrase());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody);
        }catch(Exception e){
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            errorBody.put("message", e.getMessage());
            errorBody.put("error", "Internal server error");
            errorBody.put("timestamp", LocalDateTime.now().toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody);
        }
        
    }
}

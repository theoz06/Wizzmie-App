package com.wizzmie.server_app.Services.Implements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.DTO.Request.AuthRequest;
import com.wizzmie.server_app.DTO.Respon.AuthResponse;
import com.wizzmie.server_app.utils.JwtService;


@Service
public class AuthServiceImpl {
    
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthServiceImpl(AuthenticationManager authenticationManager, JwtService jwtService){
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }


    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getNik(),
                request.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String nik = request.getNik();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        String token = jwtService.generateToken(nik, role);


        return new AuthResponse(token);
    }
    
    public void logout()

}

package com.wizzmie.server_app.Services.Implements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.DTO.Request.AuthRequest;
import com.wizzmie.server_app.DTO.Respon.AuthResponse;
import com.wizzmie.server_app.DTO.Respon.UserResponse;
import com.wizzmie.server_app.Entity.User;
import com.wizzmie.server_app.Repository.UserRepository;
import com.wizzmie.server_app.utils.JwtService;


@Service
public class AuthServiceImpl {
    
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;


    public AuthServiceImpl(AuthenticationManager authenticationManager, JwtService jwtService, UserRepository userRepository){
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
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

        User user = userRepository.findByNik(nik).get();

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        UserResponse userResponse = new UserResponse(
            user.getId(),
            user.getName(),
            user.getNik(),
            user.getRole().getUsersRole().toUpperCase()
        );

        return new AuthResponse(token, userResponse);
    }
    

}

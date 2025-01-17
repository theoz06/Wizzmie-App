package com.wizzmie.server_app.Services.Implements;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        try {
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
    
            User user = userRepository.findByNik(nik).orElseThrow(()-> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    
            UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getName(),
                user.getNik(),
                user.getRole().getUsersRole().toUpperCase()
            );
    
            return new AuthResponse(token, userResponse);
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid nik or password.");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred during login");
        }
    }
    

}

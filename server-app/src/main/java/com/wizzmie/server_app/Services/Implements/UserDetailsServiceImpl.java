package com.wizzmie.server_app.Services.Implements;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.Entity.User;
import com.wizzmie.server_app.Repository.UserRepository;


@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String nik) throws UsernameNotFoundException {

        
        
        User user = userRepository.findByNik(nik).orElseThrow(()-> new UsernameNotFoundException("User not found"));

        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getUsersRole().toUpperCase());

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getNik())
            .password(user.getPassword())
            .authorities(authority)
            .build();
    }
    
}
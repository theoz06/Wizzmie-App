package com.wizzmie.server_app.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.wizzmie.server_app.Services.Implements.UserDetailsServiceImpl;



@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                                .antMatchers("/api/order/active-orders/kitchen").hasAnyAuthority("KITCHEN")
                                .antMatchers("/api/order/active-orders/pelayan").hasAnyAuthority("PELAYAN")
                                .antMatchers("/api/order/allActiveOrders").hasAnyAuthority("ADMIN")
                                .antMatchers("/api/menu/admin/**").hasAnyAuthority("ADMIN")
                                .antMatchers("/api/category/**").hasAnyAuthority("ADMIN")
                                .antMatchers("/api/user/**").hasAnyAuthority("ADMIN")
                                .antMatchers("/api/menu/public").permitAll()
                                .antMatchers("/api/customer/**").permitAll()
                                .antMatchers("/api/order/customer/**").permitAll()
                                .anyRequest().authenticated()
                )
               .httpBasic(Customizer.withDefaults());

        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider (){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsServiceImpl);

        return authProvider;
    }

    @Bean
    public AuthenticationProvider authenticationProviderBean() {
        return authenticationProvider();
        
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

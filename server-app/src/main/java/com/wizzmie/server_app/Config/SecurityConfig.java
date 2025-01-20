package com.wizzmie.server_app.Config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.wizzmie.server_app.Services.Implements.UserDetailsServiceImpl;
import com.wizzmie.server_app.utils.JwtAuthenticationFilter;



@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .requiresChannel(channel -> channel
                    .requestMatchers(request -> "http".equals(request.getScheme()))
                    .requiresSecure());

        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                                .antMatchers("/api/order/active-orders/kitchen").hasAnyAuthority("KITCHEN")
                                .antMatchers("/api/order/active-orders/pelayan").hasAnyAuthority("PELAYAN")
                                .antMatchers("/api/order/allActiveOrders").hasAnyAuthority("ADMIN")
                                .antMatchers("/api/menu/admin/**").hasAnyAuthority("ADMIN")
                                .antMatchers("/api/category/admin/**").hasAnyAuthority("ADMIN")
                                .antMatchers("/api/admin/users").hasAnyAuthority("ADMIN")
                                .antMatchers("/api/role").hasAnyAuthority("ADMIN")
                                .antMatchers("/api/menu/public").permitAll()
                                .antMatchers("/api/order/history").hasAnyAuthority("ADMIN")
                                .antMatchers("/api/category/public").permitAll()
                                .antMatchers("/api/customer/**").permitAll()
                                .antMatchers("/api/images/**").permitAll()
                                .antMatchers("/api/auth/login").permitAll()
                                .antMatchers("/api/orderpage/**").permitAll()
                                .antMatchers("/api/order/customer/**").permitAll()
                                .antMatchers("/api/recommendations/**").permitAll()
                                .antMatchers("/ws/**").permitAll()
                                .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "https://wizzmie-cibaduyut.vercel.app"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        configuration.setExposedHeaders(Arrays.asList(
        "Authorization", "Content-Type"
    ));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    
    return source;
    }
}

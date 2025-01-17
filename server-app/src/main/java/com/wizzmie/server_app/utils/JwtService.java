package com.wizzmie.server_app.utils;

import java.util.Date;

import java.security.Key;

import javax.crypto.spec.SecretKeySpec;


import org.springframework.stereotype.Service;

import com.wizzmie.server_app.Config.JwtConfig;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtService {
    
    private final JwtConfig jwtConfig;

    public JwtService(JwtConfig jwtConfig){
        this.jwtConfig = jwtConfig;
    }


    public String generateToken(String nik, String role){
         Key secretKey = new SecretKeySpec(jwtConfig.getSecret().getBytes(), SignatureAlgorithm.HS256.getJcaName());
        return Jwts.builder()
            .setSubject(nik)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
            .signWith(secretKey, SignatureAlgorithm.HS256)
            .compact();
    }

    public String extractNik(String token){
        return Jwts.parserBuilder().setSigningKey(jwtConfig.getSecret().getBytes()).build().parseClaimsJws(token).getBody().getSubject();
    }

    public String extractRole(String token){
        return Jwts.parserBuilder().setSigningKey(jwtConfig.getSecret().getBytes()).build().parseClaimsJws(token).getBody().get("role", String.class);
    }

    public Boolean validateToken(String token){
        try {
            Jwts.parserBuilder().setSigningKey(jwtConfig.getSecret().getBytes()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e){
            return false;
        }
    }
}

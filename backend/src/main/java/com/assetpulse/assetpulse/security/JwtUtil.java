package com.assetpulse.assetpulse.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "assetpulse_secret_key_assetpulse_secret_key";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String userId, String role) {

        return Jwts.builder()

                .setSubject(userId)

                .claim("role", role)

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)
                )

                .signWith(key)

                .compact();
    }


    public String extractUserId(String token) {

        return Jwts.parserBuilder()

                .setSigningKey(key)

                .build()

                .parseClaimsJws(token)

                .getBody()

                .getSubject();
    }


    public String extractRole(String token) {

        return (String) Jwts.parserBuilder()

                .setSigningKey(key)

                .build()

                .parseClaimsJws(token)

                .getBody()

                .get("role");
    }
}
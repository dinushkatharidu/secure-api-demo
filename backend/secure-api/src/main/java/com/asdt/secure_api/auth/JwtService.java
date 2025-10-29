    package com.asdt.secure_api.auth;
    
    import io.jsonwebtoken.JwtException;
    import io.jsonwebtoken.Jwts;
    import io.jsonwebtoken.SignatureAlgorithm;
    import io.jsonwebtoken.io.Decoders;
    import io.jsonwebtoken.security.Keys;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.stereotype.Service;
    
    import javax.crypto.SecretKey;
    import java.security.Key;
    import java.time.Instant;
    import java.util.Date;
    
    @Service
    public class JwtService {
        private final SecretKey key;
        private final long expMinutes;
    
        public JwtService(
                @Value("${app.jwt.secret}") String secret,
                @Value("${app.jwt.expMinutes}") long expMinutes) {
    
            byte[] keyBytes = Decoders.BASE64.decode(secret); // decode Base64
            this.key = Keys.hmacShaKeyFor(keyBytes);          // build a strong HS256 key
            this.expMinutes = expMinutes;
        }
    
        public String generateToken(String username){
            Instant now = Instant.now();
            return Jwts.builder()
                    .setSubject(username)
                    .setIssuedAt(Date.from(now))
                    .setExpiration(Date.from(now.plusSeconds(expMinutes*60)))
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();
        }
    
        public String extractUsername(String token){
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        }
    
        public boolean isValid(String token){
            try{
                Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token);
                return true;
    
            } catch (JwtException | IllegalArgumentException e) {
                return false;
            }
        }
    
    
    }

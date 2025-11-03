package com.asdt.secure_api.auth;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    @Test
    void generate_and_validate_token_round_trip() {
        // Use your real Base64 secret (>= 256-bit)
        String secret = "+cTQU/Nv+QljnOwNXX+jncNQvwOU1pMFqVz/RwugkCI=";
        long expMinutes = 60L;

        JwtService jwt = new JwtService(secret, expMinutes);

        String token = jwt.generateToken("dinushka");
        assertNotNull(token);
        assertFalse(token.isBlank());
        assertEquals(3, token.split("\\.").length, "JWT should have 3 parts");

        assertEquals("dinushka", jwt.extractUsername(token));
        assertTrue(jwt.isValid(token));

        // Tamper and ensure invalid
        assertFalse(jwt.isValid(token + "broken"));
    }
}
